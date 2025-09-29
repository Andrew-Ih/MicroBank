from sqlalchemy.orm import Session
from ..models.transaction import Transaction
from ..models.outbox import Outbox
from ..schemas.transaction_schemas import CreateTransactionRequest
from .outbox_service import OutboxService
import json
from datetime import datetime

class TransactionService:
    def __init__(self, db: Session):
        self.db = db
        self.outbox_service = OutboxService(db)
    
    def create_transaction(self, request: CreateTransactionRequest, idempotency_key: str):
        # Check existing
        existing = self.db.query(Transaction).filter(
            Transaction.account_id == request.account_id,
            Transaction.idempotency_key == idempotency_key
        ).first()
        
        if existing:
            return existing
        
        # Create transaction
        transaction = Transaction(
            account_id=request.account_id,
            kind=request.kind,
            amount_cents=request.amount_cents,
            idempotency_key=idempotency_key
        )
        
        # Create outbox entry
        payload = {
            "tx_id": str(transaction.id),
            "account_id": request.account_id,
            "kind": request.kind,
            "amount_cents": request.amount_cents,
            "requested_at": datetime.utcnow().isoformat()
        }
        
        self.db.add(transaction)
        self.outbox_service.create_event("microbank.transactions.requested", payload)
        self.db.commit()
        
        return transaction
