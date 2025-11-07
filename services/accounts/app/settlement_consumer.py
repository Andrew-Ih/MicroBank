import asyncio
import boto3
import json
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models.transaction import Transaction
from .config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, SQS_ACCOUNTS_SETTLEMENTS_URL
from datetime import datetime

async def consume_settlements():
    """Background task to consume settlement events from SQS"""
    # Configure SQS client for real AWS
    sqs_config = {
        'aws_access_key_id': AWS_ACCESS_KEY_ID,
        'aws_secret_access_key': AWS_SECRET_ACCESS_KEY,
        'region_name': AWS_REGION
    }
    
    sqs = boto3.client('sqs', **sqs_config)
    
    while True:
        db = SessionLocal()
        try:
            # Poll for messages
            response = sqs.receive_message(
                QueueUrl=SQS_ACCOUNTS_SETTLEMENTS_URL,
                MaxNumberOfMessages=10,
                WaitTimeSeconds=20
            )
            
            messages = response.get('Messages', [])
            
            for message in messages:
                try:
                    # Parse SNS notification
                    sns_message = json.loads(message['Body'])
                    settlement_data = json.loads(sns_message['Message'])
                    
                    # Update transaction status
                    tx_id = settlement_data['tx_id']
                    outcome = settlement_data['outcome']
                    
                    transaction = db.query(Transaction).filter(Transaction.id == tx_id).first()
                    if transaction:
                        transaction.status = 'completed' if outcome == 'approved' else 'failed'
                        transaction.outcome = outcome
                        db.commit()
                        print(f"Updated transaction {tx_id} status to {transaction.status}")
                    
                    # Delete message from queue
                    sqs.delete_message(
                        QueueUrl=SQS_ACCOUNTS_SETTLEMENTS_URL,
                        ReceiptHandle=message['ReceiptHandle']
                    )
                    
                    print(f"Processed settlement for transaction {tx_id}")
                    
                except Exception as e:
                    print(f"Failed to process settlement message: {e}")
                    db.rollback()
            
        except Exception as e:
            print(f"Error consuming settlement messages: {e}")
            await asyncio.sleep(5)
        finally:
            db.close()
        
        # Brief pause before next poll
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(consume_settlements())