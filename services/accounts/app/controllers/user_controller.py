from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.user_service import UserService
from ..schemas.user_schemas import CreateUserRequest, UserResponse

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.post("/", response_model=UserResponse)
def create_user(request: CreateUserRequest, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user = user_service.create_user(request)
    return UserResponse(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at
    )
