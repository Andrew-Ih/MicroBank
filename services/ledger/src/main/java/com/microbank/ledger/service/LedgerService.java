package com.microbank.ledger.service;

import com.microbank.ledger.dto.TransactionRequest;
import com.microbank.ledger.dto.SettlementEvent;
import com.microbank.ledger.entity.EntryKind;
import com.microbank.ledger.entity.LedgerEntry;
import com.microbank.ledger.repository.LedgerEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class LedgerService {
    
    private static final Logger logger = LoggerFactory.getLogger(LedgerService.class);
    
    @Autowired
    private LedgerEntryRepository ledgerEntryRepository;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    @Transactional
    public void processTransaction(TransactionRequest request) {
        logger.info("Processing transaction: {} for account: {}", 
                   request.getTxId(), request.getAccountId());
        
        // Check if transaction already processed (idempotency)
        if (ledgerEntryRepository.existsByTxId(request.getTxId())) {
            logger.warn("Transaction {} already processed, skipping", request.getTxId());
            return;
        }
        
        // Validate business rules
        String outcome = validateTransaction(request);
        
        if ("approved".equals(outcome)) {
            // Create ledger entry
            EntryKind entryKind = "deposit".equals(request.getKind()) ? 
                EntryKind.CREDIT : EntryKind.DEBIT;
            
            LedgerEntry entry = new LedgerEntry(
                request.getAccountId(),
                request.getTxId(),
                entryKind,
                request.getAmountCents()
            );
            
            ledgerEntryRepository.save(entry);
            logger.info("Created ledger entry for transaction: {}", request.getTxId());
        }
        
        // Calculate new balance
        Long newBalance = ledgerEntryRepository.calculateBalance(request.getAccountId());
        
        // Publish settlement event
        SettlementEvent settlement = new SettlementEvent(
            request.getTxId(),
            request.getAccountId(),
            outcome,
            newBalance
        );
        
        eventPublisher.publishSettlement(settlement);
        logger.info("Published settlement for transaction: {} with outcome: {}", 
                   request.getTxId(), outcome);
    }
    
    private String validateTransaction(TransactionRequest request) {
        // For withdrawals, check if sufficient balance
        if ("withdraw".equals(request.getKind())) {
            Long currentBalance = ledgerEntryRepository.calculateBalance(request.getAccountId());
            
            if (currentBalance < request.getAmountCents()) {
                logger.warn("Insufficient funds for withdrawal. Balance: {}, Requested: {}", 
                           currentBalance, request.getAmountCents());
                return "rejected";
            }
        }
        
        // All deposits are approved, withdrawals approved if sufficient funds
        return "approved";
    }
    
    public Long getBalance(UUID accountId) {
        return ledgerEntryRepository.calculateBalance(accountId);
    }
}
