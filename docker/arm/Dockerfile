FROM node:12-alpine3.10 AS builder

LABEL maintainer="sebastian@raubach.co.uk"

COPY qemu-arm-static /usr/bin/qemu-arm-static

ARG BRANCH=master

# Force docker to not cache the next line
ADD https://api.github.com/repos/sebastian-raubach/sgud-client/git/refs/heads/master version.json
# Clone the Germinate server code and client code
RUN echo "Pulling GitHub branch: $BRANCH"
RUN apk add --no-cache git && \
    git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/sebastian-raubach/sgud-server.git /opt/sgud-server && \
    git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/sebastian-raubach/sgud-client.git /opt/sgud-client

# Build the client code
WORKDIR /opt/sgud-client
RUN rm -f .env && \
    echo "VUE_APP_BASE_URL=./api/" > .env && \
    apk add --no-cache python build-base gcc wget && \
    npm i && \
    npm run build && \
    mkdir /opt/sgud-server/client/ && \
    cp -a /opt/sgud-client/dist/. /opt/sgud-server/client/

# Download Ant and build the server code
RUN apk add --no-cache openjdk8 && \
    wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    echo "config.path=/data/sgud/" > /opt/sgud-server/config.properties && \
    echo "project.name=sgud" > /opt/sgud-server/gradle.properties && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/sgud-server war



FROM arm32v7/tomcat:8-jre8

LABEL maintainer="sebastian@raubach.co.uk"

RUN mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT

COPY --from=builder /opt/sgud-server/build/libs/sgud-server-1.0.0.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /usr/local/tomcat/