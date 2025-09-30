import asyncio
import boto3
import json
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models.outbox import Outbox
from .config import AWS_ENDPOINT_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, SNS_TOPIC_ARN
from datetime import datetime

async def publish_outbox_events():
    """Background task to publish outbox events to SNS"""
    sns = boto3.client(
        'sns',
        endpoint_url=AWS_ENDPOINT_URL,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    
    while True:
        db = SessionLocal()
        try:
            # Get unpublished events
            pending_events = db.query(Outbox).filter(Outbox.published_at.is_(None)).all()
            
            for event in pending_events:
                try:
                    # Publish to SNS
                    response = sns.publish(
                        TopicArn=SNS_TOPIC_ARN,
                        Message=event.payload,
                        MessageAttributes={
                            'event_type': {
                                'DataType': 'String',
                                'StringValue': event.event_type
                            }
                        }
                    )
                    
                    # Mark as published
                    event.published_at = datetime.utcnow()
                    db.commit()
                    
                    print(f"Published event {event.id} to SNS: {response['MessageId']}")
                    
                except Exception as e:
                    print(f"Failed to publish event {event.id}: {e}")
                    db.rollback()
            
        finally:
            db.close()
        
        # Wait 5 seconds before checking again
        await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(publish_outbox_events())
