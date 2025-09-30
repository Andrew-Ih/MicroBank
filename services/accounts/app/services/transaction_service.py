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
        
        # Add to DB first to get the ID
        self.db.add(transaction)
        self.db.flush()  # This generates the ID without committing
        
        # Create outbox entry with correct transaction ID
        payload = {
            "tx_id": str(transaction.id),  # Now this will have the actual ID
            "account_id": request.account_id,
            "kind": request.kind,
            "amount_cents": request.amount_cents,
            "requested_at": datetime.utcnow().isoformat()
        }
        
        self.outbox_service.create_event("microbank.transactions.requested", payload)
        self.db.commit()  # Commit everything together
        
        return transaction
    
    def get_account_transactions(self, account_id: str):
        transactions = self.db.query(Transaction).filter(
            Transaction.account_id == account_id
        ).order_by(Transaction.requested_at.desc()).all()
        
        return [{
            "id": str(tx.id),
            "type": tx.kind,
            "amount": tx.amount_cents / 100,
            "status": tx.status,  # This will be "pending" initially
            "description": f"{tx.kind.title()} Transaction",
            "timestamp": tx.requested_at.isoformat(),
        } for tx in transactions]


