package com.microbank.ledger.entity;

import jakarta.persistence.*;
// import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ledger_entries")
public class LedgerEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "account_id", nullable = false)
    private UUID accountId;
    
    @Column(name = "tx_id", nullable = false, unique = true)
    private UUID txId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryKind kind;
    
    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public LedgerEntry() {
        this.createdAt = LocalDateTime.now();
    }
    
    public LedgerEntry(UUID accountId, UUID txId, EntryKind kind, Long amountCents) {
        this();
        this.accountId = accountId;
        this.txId = txId;
        this.kind = kind;
        this.amountCents = amountCents;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    
    public UUID getTxId() { return txId; }
    public void setTxId(UUID txId) { this.txId = txId; }
    
    public EntryKind getKind() { return kind; }
    public void setKind(EntryKind kind) { this.kind = kind; }
    
    public Long getAmountCents() { return amountCents; }
    public void setAmountCents(Long amountCents) { this.amountCents = amountCents; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
