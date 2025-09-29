from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user_schemas import CreateUserRequest

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, request: CreateUserRequest):
        user = User(email=request.email)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
