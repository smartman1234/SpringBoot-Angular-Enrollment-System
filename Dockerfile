# syntax=docker/dockerfile:1

FROM adoptopenjdk/openjdk11:alpine as backend-builder
WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw package -DskipTests -B
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM adoptopenjdk/openjdk11:alpine-jre as backend
ARG DEPENDENCY=/app/target/dependency

COPY --from=backend-builder $DEPENDENCY/BOOT-INF/lib /app/lib
COPY --from=backend-builder $DEPENDENCY/BOOT-INF/classes /app
COPY --from=backend-builder $DEPENDENCY/META-INF /app/META-INF

RUN addgroup -S spring-group && adduser -S spring-user -G spring-group

RUN chown -R spring-user:spring-group /app
RUN chmod 777 /app

USER spring-user:spring-group

ENTRYPOINT ["java","-cp","app:app/lib/*","io.spring.enrollmentsystem.EnrollmentSystemApplication"]

FROM node:14-alpine as frontend-builder
WORKDIR /app
COPY webapp/package.json webapp/package-lock.json ./
RUN npm install
COPY /webapp .
RUN npm run build

FROM nginx:1.20.2-alpine as frontend
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-builder /app/dist/out /usr/share/nginx/html