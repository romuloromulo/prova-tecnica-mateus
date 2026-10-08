# ==========================================
# Estágio 1: Build do Backend (Maven + Eclipse Temurin 21)
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache de dependências Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia código-fonte e compila o JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Estágio 2: Imagem de Execução Leve (JRE 21 Alpine)
# ==========================================
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Cria usuário não-root para segurança corporativa
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copia o artefato executável gerado
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

# Parâmetros otimizados para container JVM
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
