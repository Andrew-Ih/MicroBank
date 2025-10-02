# MicroBank

Polyglot microservices banking platform demonstrating event-driven architecture with Python, Java/Spring Boot, Express.js and React.

## Architecture Diagram

![MicroBank Architecture](img/Microbank-Architecture-Diagram.png)

**Core Services:**
- **Accounts Service** (Python) - User management, account operations
- **Ledger Service** (Java/Spring Boot) - Transaction processing, balance tracking
- **Notifications Service** (Node.js/Express.js) - Real-time notifications
- **Frontend** (React) - User interface

**Infrastructure:**
- Event-driven messaging via SNS/SQS
- Per-service PostgreSQL databases
- S3 storage for documents
- Observability: OpenTelemetry, Jaeger, Prometheus, Grafana

**Key Features:**
- Idempotent transactions with outbox pattern
- Real-time notifications
- Microservices isolation

## Screenshots

### Landing Page
![Landing Page](img/LandingPage.jpeg)

### Dashboard
![Dashboard](img/Dashboard.jpeg)

### Dashboard with Notifications
![Dashboard with Notifications](img/Dashboard-with-notifications.png)

### Transaction Modals
<div style="display: flex; gap: 20px;">
  <img src="img/MoneyDepositModal.png" alt="Money Deposit" width="300">
  <img src="img/MoneyWithdrawalModal.png" alt="Money Withdrawal" width="300">
</div>

## Quick Start

```bash
docker-compose up -d
```

Access the application at `http://localhost:8080`
