package com.microbank.ledger.repository;

import com.microbank.ledger.entity.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {
    
    // Check if transaction already exists (idempotency)
    boolean existsByTxId(UUID txId);
    
    // Get transaction history for an account
    List<LedgerEntry> findByAccountIdOrderByCreatedAtDesc(UUID accountId);
    
    // Calculate current balance for an account
    @Query("SELECT COALESCE(SUM(CASE WHEN l.kind = 'CREDIT' THEN l.amountCents ELSE -l.amountCents END), 0) " +
           "FROM LedgerEntry l WHERE l.accountId = :accountId")
    Long calculateBalance(@Param("accountId") UUID accountId);
}
