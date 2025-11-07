package com.microbank.ledger.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class SettlementEvent {
    
    @JsonProperty("tx_id")
    private UUID txId;
    
    @JsonProperty("account_id")
    private UUID accountId;
    
    private String outcome; // "approved" or "rejected"
    
    @JsonProperty("balance_cents")
    private Long balanceCents;
    
    @JsonProperty("applied_at")
    private String appliedAt;
    
    // Constructors
    public SettlementEvent() {}
    
    public SettlementEvent(UUID txId, UUID accountId, String outcome, Long balanceCents) {
        this.txId = txId;
        this.accountId = accountId;
        this.outcome = outcome;
        this.balanceCents = balanceCents;
        this.appliedAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
    
    // Getters and Setters
    public UUID getTxId() { return txId; }
    public void setTxId(UUID txId) { this.txId = txId; }
    
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    
    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }
    
    public Long getBalanceCents() { return balanceCents; }
    public void setBalanceCents(Long balanceCents) { this.balanceCents = balanceCents; }
    
    public String getAppliedAt() { return appliedAt; }
    public void setAppliedAt(String appliedAt) { this.appliedAt = appliedAt; }
}
