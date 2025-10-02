from sqlalchemy import Column, String, BigInteger, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base
import uuid
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False)
    kind = Column(String, nullable=False)
    amount_cents = Column(BigInteger, nullable=False)
    status = Column(String, default="pending")
    outcome = Column(String)
    idempotency_key = Column(String, nullable=False)
    requested_at = Column(DateTime, default=datetime.utcnow)
    
    account = relationship("Account", back_populates="transactions")
