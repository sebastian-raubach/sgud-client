FROM arm32v7/tomcat:8-jre8

LABEL maintainer="sebastian@raubach.co.uk"

COPY qemu-arm-static /usr/bin/qemu-arm-static

# Clone the Germinate server code and client code
RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/sebastian-raubach/sgud-server.git /opt/sgud-server && \
    git clone https://github.com/sebastian-raubach/sgud-vue.git /opt/sgud-client

# Install node.js
RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

# Build the client code
WORKDIR /opt/sgud-client
RUN rm -f .env && \
    echo "VUE_APP_BASE_URL=./api/" > .env
RUN apt-get install -y build-essential && \
    rm -f package-lock.json && \
    npm i && \
    npm run build && \
    mkdir /opt/sgud-server/client/ && \
    cp -a /opt/sgud-client/dist/. /opt/sgud-server/client/

# Download Gradle and build the server code
RUN apt-get update && \
    apt-get install -y wget openjdk-8-jdk gradle && \
    echo "data.directory.external=/data/sgud" > /opt/sgud-server/config.properties && \
    echo "project.name=sgud" >> /opt/sgud-server/gradle.properties && \
    echo "org.gradle.jvmargs=-Xmx1536m -Xms512m -XX:+HeapDumpOnOutOfMemoryError" >> /opt/sgud-server/gradle.properties && \
    gradle --no-daemon --no-rebuild --max-workers=1 -p /opt/sgud-server war && \
    mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT && \
    cp /opt/sgud-server/build/libs/sgud-1.0.0.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /