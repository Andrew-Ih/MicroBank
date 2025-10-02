package com.microbank.ledger.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microbank.ledger.dto.SettlementEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;

import java.net.URI;

@Service
public class EventPublisher {
    
    private static final Logger logger = LoggerFactory.getLogger(EventPublisher.class);
    
    private final SnsClient snsClient;
    private final ObjectMapper objectMapper;
    
    @Value("${aws.sns.topic-arn}")
    private String topicArn;
    
    public EventPublisher(@Value("${aws.endpoint}") String endpoint,
                         @Value("${aws.region}") String region,
                         @Value("${aws.access-key}") String accessKey,
                         @Value("${aws.secret-key}") String secretKey) {
        
        this.objectMapper = new ObjectMapper();
        
        this.snsClient = SnsClient.builder()
            .endpointOverride(URI.create(endpoint))
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            .build();
    }
    
    public void publishSettlement(SettlementEvent settlement) {
        try {
            String message = objectMapper.writeValueAsString(settlement);
            
            PublishRequest request = PublishRequest.builder()
                .topicArn(topicArn)
                .message(message)
                .build();
            
            snsClient.publish(request);
            logger.info("Published settlement event for transaction: {}", settlement.getTxId());
            
        } catch (Exception e) {
            logger.error("Failed to publish settlement event", e);
            throw new RuntimeException("Failed to publish settlement event", e);
        }
    }
}
