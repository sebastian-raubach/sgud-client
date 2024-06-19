FROM node:20-alpine3.17 AS builder

LABEL maintainer="sebastian@raubach.co.uk"

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
    apk add --no-cache python3 build-base gcc wget && \
    npm i && \
    npm run build && \
    mkdir /opt/sgud-server/client/ && \
    cp -a /opt/sgud-client/dist/. /opt/sgud-server/client/

# Download Gradle and build the server code
RUN apk add --no-cache openjdk11 && \
    wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    echo "config.path=/data/sgud/" > /opt/sgud-server/config.properties && \
    echo "project.name=sgud" > /opt/sgud-server/gradle.properties && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/sgud-server war


FROM tomcat:10.1-jdk11

LABEL maintainer="sebastian@raubach.co.uk"

RUN mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT

COPY --from=builder /opt/sgud-server/build/libs/sgud-*.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /usr/local/tomcat/
