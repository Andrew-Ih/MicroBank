from pydantic import BaseModel

class CreateAccountRequest(BaseModel):
    user_id: str

class AccountResponse(BaseModel):
    id: str
    user_id: str
    currency: str
    status: str
    
    class Config:
        from_attributes = True
