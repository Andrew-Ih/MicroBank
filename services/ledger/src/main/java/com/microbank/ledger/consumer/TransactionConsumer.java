package com.microbank.ledger.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microbank.ledger.dto.TransactionRequest;
import com.microbank.ledger.service.LedgerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.DeleteMessageRequest;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageResponse;

import jakarta.annotation.PostConstruct;
import java.net.URI;
import java.util.List;

@Component
public class TransactionConsumer {
    
    private static final Logger logger = LoggerFactory.getLogger(TransactionConsumer.class);
    
    private final SqsClient sqsClient;
    private final ObjectMapper objectMapper;
    
    @Autowired
    private LedgerService ledgerService;
    
    @Value("${aws.sqs.queue-url}")
    private String queueUrl;
    
    public TransactionConsumer(@Value("${aws.endpoint}") String endpoint,
                              @Value("${aws.region}") String region,
                              @Value("${aws.access-key}") String accessKey,
                              @Value("${aws.secret-key}") String secretKey) {
        
        this.objectMapper = new ObjectMapper();
        
        this.sqsClient = SqsClient.builder()
            .endpointOverride(URI.create(endpoint))
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            .build();
    }
    
    @PostConstruct
    @Async
    public void startConsuming() {
        logger.info("Starting SQS consumer for queue: {}", queueUrl);
        
        while (true) {
            try {
                // Poll for messages
                ReceiveMessageRequest receiveRequest = ReceiveMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .maxNumberOfMessages(10)
                    .waitTimeSeconds(20) // Long polling
                    .build();
                
                ReceiveMessageResponse response = sqsClient.receiveMessage(receiveRequest);
                List<Message> messages = response.messages();
                
                for (Message message : messages) {
                    processMessage(message);
                }
                
            } catch (Exception e) {
                logger.error("Error consuming SQS messages", e);
                // Wait before retrying
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }
    
    private void processMessage(Message message) {
        try {
            logger.info("Processing SQS message: {}", message.messageId());
            
            // Parse the transaction request
            TransactionRequest request = objectMapper.readValue(
                message.body(), TransactionRequest.class);
            
            // Process the transaction
            ledgerService.processTransaction(request);
            
            // Delete message from queue (acknowledge processing)
            DeleteMessageRequest deleteRequest = DeleteMessageRequest.builder()
                .queueUrl(queueUrl)
                .receiptHandle(message.receiptHandle())
                .build();
            
            sqsClient.deleteMessage(deleteRequest);
            logger.info("Successfully processed and deleted message: {}", message.messageId());
            
        } catch (Exception e) {
            logger.error("Failed to process SQS message: {}", message.messageId(), e);
            // Message will remain in queue and be retried
        }
    }
}
