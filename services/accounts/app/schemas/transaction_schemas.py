from pydantic import BaseModel

class CreateTransactionRequest(BaseModel):
    account_id: str
    kind: str
    amount_cents: int

class TransactionResponse(BaseModel):
    id: str
    status: str
    
    class Config:
        from_attributes = True
