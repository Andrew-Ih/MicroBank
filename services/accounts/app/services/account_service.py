from sqlalchemy.orm import Session
from ..models.account import Account
from ..schemas.account_schemas import CreateAccountRequest

class AccountService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_account(self, request: CreateAccountRequest):
        account = Account(user_id=request.user_id)
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account
