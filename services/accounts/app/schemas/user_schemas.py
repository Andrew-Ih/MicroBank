from pydantic import BaseModel
from datetime import datetime

class CreateUserRequest(BaseModel):
    email: str

class UserResponse(BaseModel):
    id: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserWithAccountResponse(BaseModel):
    user_id: str
    email: str
    account_id: str
    currency: str
    status: str
    created_at: datetime
