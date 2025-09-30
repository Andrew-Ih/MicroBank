#!/bin/bash
# Create SNS topics
awslocal sns create-topic --name microbank-transactions-requested
awslocal sns create-topic --name microbank-transactions-settled

# Create SQS queues
awslocal sqs create-queue --queue-name ledger-transactions
awslocal sqs create-queue --queue-name accounts-settlements
awslocal sqs create-queue --queue-name notifications-settlements

# Subscribe queues to topics
awslocal sns subscribe \
  --topic-arn arn:aws:sns:ca-central-1:000000000000:microbank-transactions-requested \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:ca-central-1:000000000000:ledger-transactions

awslocal sns subscribe \
  --topic-arn arn:aws:sns:ca-central-1:000000000000:microbank-transactions-settled \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:ca-central-1:000000000000:accounts-settlements

awslocal sns subscribe \
  --topic-arn arn:aws:sns:ca-central-1:000000000000:microbank-transactions-settled \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:ca-central-1:000000000000:notifications-settlements

# Create S3 bucket
awslocal s3 mb s3://microbank-receipts
