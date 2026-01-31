# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml mvnw .mvn/ ./
COPY src ./src
# Use Maven wrapper to build (takes advantage of layers)
RUN ./mvnw -DskipTests package -q

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
# mountable uploads folder
VOLUME ["/app/uploads"]
CMD ["java", "-Xmx512m", "-jar", "/app/app.jar"]
