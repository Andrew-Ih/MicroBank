package com.microbank.ledger.controller;

import com.microbank.ledger.entity.LedgerEntry;
import com.microbank.ledger.repository.LedgerEntryRepository;
import com.microbank.ledger.service.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1")
@CrossOrigin(origins = "*")
public class LedgerController {
    
    @Autowired
    private LedgerService ledgerService;
    
    @Autowired
    private LedgerEntryRepository ledgerEntryRepository;
    
    @GetMapping("/balances/{accountId}")
    public ResponseEntity<BalanceResponse> getBalance(@PathVariable UUID accountId) {
        Long balanceCents = ledgerService.getBalance(accountId);
        return ResponseEntity.ok(new BalanceResponse(accountId, balanceCents));
    }
    
    @GetMapping("/entries/{accountId}")
    public ResponseEntity<List<LedgerEntry>> getEntries(
            @PathVariable UUID accountId,
            @RequestParam(defaultValue = "50") int limit) {
        
        List<LedgerEntry> entries = ledgerEntryRepository
            .findByAccountIdOrderByCreatedAtDesc(accountId);
        
        // Limit results
        if (entries.size() > limit) {
            entries = entries.subList(0, limit);
        }
        
        return ResponseEntity.ok(entries);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Ledger Service is healthy");
    }
    
    // Inner class for balance response
    public static class BalanceResponse {
        private UUID accountId;
        private Long balanceCents;
        
        public BalanceResponse(UUID accountId, Long balanceCents) {
            this.accountId = accountId;
            this.balanceCents = balanceCents;
        }
        
        // Getters
        public UUID getAccountId() { return accountId; }
        public Long getBalanceCents() { return balanceCents; }
    }
}
