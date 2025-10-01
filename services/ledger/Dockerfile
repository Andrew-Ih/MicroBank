FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

# Run the application
EXPOSE 8001
CMD ["java", "-jar", "target/ledger-service-1.0.0.jar"]
