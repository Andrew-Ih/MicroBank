from sqlalchemy import Column, String, BigInteger, DateTime
from ..database import Base
from datetime import datetime

class Outbox(Base):
    __tablename__ = "outbox"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    event_type = Column(String, nullable=False)
    payload = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    published_at = Column(DateTime)
