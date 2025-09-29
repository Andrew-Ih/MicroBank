from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.account_service import AccountService
from ..schemas.account_schemas import CreateAccountRequest, AccountResponse

router = APIRouter(prefix="/v1/accounts", tags=["accounts"])

@router.post("/", response_model=AccountResponse)
def create_account(request: CreateAccountRequest, db: Session = Depends(get_db)):
    account_service = AccountService(db)
    account = account_service.create_account(request)
    return AccountResponse(
        id=str(account.id),
        user_id=str(account.user_id),
        currency=account.currency,
        status=account.status
    )
