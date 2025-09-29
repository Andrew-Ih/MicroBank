from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.transaction_service import TransactionService
from ..schemas.transaction_schemas import CreateTransactionRequest, TransactionResponse

router = APIRouter(prefix="/v1/transactions", tags=["transactions"])

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    request: CreateTransactionRequest,
    db: Session = Depends(get_db),
    idempotency_key: str = Header(alias="Idempotency-Key")
):
    transaction_service = TransactionService(db)
    transaction = transaction_service.create_transaction(request, idempotency_key)
    return TransactionResponse(
        id=str(transaction.id),
        status=transaction.status
    )
