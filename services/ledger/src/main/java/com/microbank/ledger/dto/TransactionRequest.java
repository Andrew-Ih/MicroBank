package com.microbank.ledger.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public class TransactionRequest {
    
    @JsonProperty("tx_id")
    private UUID txId;
    
    @JsonProperty("account_id")
    private UUID accountId;
    
    private String kind; // "deposit" or "withdraw"
    
    @JsonProperty("amount_cents")
    private Long amountCents;
    
    @JsonProperty("requested_at")
    private String requestedAt;
    
    // Constructors
    public TransactionRequest() {}
    
    // Getters and Setters
    public UUID getTxId() { return txId; }
    public void setTxId(UUID txId) { this.txId = txId; }
    
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    
    public String getKind() { return kind; }
    public void setKind(String kind) { this.kind = kind; }
    
    public Long getAmountCents() { return amountCents; }
    public void setAmountCents(Long amountCents) { this.amountCents = amountCents; }
    
    public String getRequestedAt() { return requestedAt; }
    public void setRequestedAt(String requestedAt) { this.requestedAt = requestedAt; }
}
