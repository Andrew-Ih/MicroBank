const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const sqs = new AWS.SQS();
const queueUrl = process.env.SQS_NOTIFICATIONS_SETTLEMENTS_URL;

// Store connected clients
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join', (accountId) => {
    console.log(`Client ${socket.id} joined account ${accountId}`);
    connectedClients.set(socket.id, accountId);
    socket.join(accountId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });
});

// SQS Consumer
async function consumeMessages() {
  console.log('Starting SQS consumer for notifications...');
  
  while (true) {
    try {
      const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
      };
      
      const result = await sqs.receiveMessage(params).promise();
      
      if (result.Messages) {
        for (const message of result.Messages) {
          await processMessage(message);
        }
      }
    } catch (error) {
      console.error('Error consuming SQS messages:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function processMessage(message) {
  try {
    console.log('Processing notification message:', message.MessageId);
    
    // Parse SNS notification
    const snsMessage = JSON.parse(message.Body);
    const settlementData = JSON.parse(snsMessage.Message);
    
    // Create notification with specific details
    const balanceDollars = (settlementData.balance_cents / 100).toFixed(2);
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const notification = {
      id: Date.now(),
      type: settlementData.outcome === 'approved' ? 'success' : 'error',
      title: settlementData.outcome === 'approved' ? 'Transaction Approved' : 'Transaction Failed',
      message: settlementData.outcome === 'approved' 
        ? `Your transaction has been approved on ${currentDate}. New balance: $${balanceDollars}`
        : `Your transaction was rejected on ${currentDate}. Please try again or contact support.`,
      accountId: settlementData.account_id,
      txId: settlementData.tx_id,
      balanceCents: settlementData.balance_cents,
      timestamp: new Date().toISOString()
    };
    
    // Send to connected clients for this account
    io.to(settlementData.account_id).emit('notification', notification);
    console.log(`Sent notification to account ${settlementData.account_id}`);
    
    // Delete message from queue
    await sqs.deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }).promise();
    
    console.log('Successfully processed notification message:', message.MessageId);
    
  } catch (error) {
    console.error('Failed to process notification message:', error);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'notifications' });
});

// Start SQS consumer
consumeMessages();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Notifications service running on port ${PORT}`);
});