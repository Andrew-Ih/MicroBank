import boto3
import json
from sqlalchemy.orm import Session
from ..models.outbox import Outbox
from ..config import AWS_ENDPOINT_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, SNS_TOPIC_ARN
from datetime import datetime

class OutboxService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_event(self, event_type: str, payload: dict):
        outbox_entry = Outbox(
            event_type=event_type,
            payload=json.dumps(payload)
        )
        self.db.add(outbox_entry)
    
    def publish_pending_events(self):
        sns = boto3.client(
            'sns',
            endpoint_url=AWS_ENDPOINT_URL,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        
        pending = self.db.query(Outbox).filter(Outbox.published_at.is_(None)).all()
        
        for event in pending:
            sns.publish(TopicArn=SNS_TOPIC_ARN, Message=event.payload)
            event.published_at = datetime.utcnow()
        
        self.db.commit()
