FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/*.jar"]
