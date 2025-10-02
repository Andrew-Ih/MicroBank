from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.user_service import UserService
from ..schemas.user_schemas import CreateUserRequest, UserWithAccountResponse

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.post("/", response_model=UserWithAccountResponse)
def create_user(request: CreateUserRequest, db: Session = Depends(get_db)):
    user_service = UserService(db)
    result = user_service.create_user_with_account(request)
    
    return UserWithAccountResponse(
        user_id=str(result["user"].id),
        email=result["user"].email,
        account_id=str(result["account"].id),
        currency=result["account"].currency,
        status=result["account"].status,
        created_at=result["user"].created_at
    )
