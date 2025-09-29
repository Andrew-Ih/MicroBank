from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..models.user import User
from ..models.account import Account
from ..schemas.user_schemas import CreateUserRequest

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user_with_account(self, request: CreateUserRequest):
        try:
            # Check if user already exists
            existing_user = self.db.query(User).filter(User.email == request.email).first()
            if existing_user:
                # Return existing user and their account
                account = self.db.query(Account).filter(Account.user_id == existing_user.id).first()
                return {"user": existing_user, "account": account}
            
            # Create new user
            user = User(email=request.email)
            self.db.add(user)
            self.db.flush()  # Get user.id without committing
            
            # Auto-create default account
            account = Account(user_id=user.id)
            self.db.add(account)
            
            self.db.commit()
            self.db.refresh(user)
            self.db.refresh(account)
            
            return {"user": user, "account": account}
            
        except IntegrityError:
            self.db.rollback()
            # Handle race condition - user was created by another request
            existing_user = self.db.query(User).filter(User.email == request.email).first()
            account = self.db.query(Account).filter(Account.user_id == existing_user.id).first()
            return {"user": existing_user, "account": account}
