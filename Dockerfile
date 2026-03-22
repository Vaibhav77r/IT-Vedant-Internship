FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /ims-project

COPY . .

# ✅ CORRECT PATH
WORKDIR /ims-project/backend

RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/ims-0.0.1-SNAPSHOT.jar"]
