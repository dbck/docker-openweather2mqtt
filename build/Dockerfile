FROM node:14.15.1-buster

LABEL maintainer "Dennis Boeckmann <dev@dbck.de>"
LABEL description "This image reads weather information from the openweather api and submit it to a mqtt broker."

ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV OPENWEATHER_LANG=en
ENV OPENWEATHER_UNITS=metric
ENV OPENWEATHER_CRON_TIMEZONE=Europe/Berlin
ENV OPENWEATHER_CRON_SCHEDULE="*/30 * * * * *"
ENV OPENWEATHER_API_URL=api.openweathermap.org
ENV OPENWEATHER_API_KEY=
ENV OPENWEATHER_CITY=Berlin
ENV OPENWEATHER_MQTT_HOST=mqtt
ENV OPENWEATHER_MQTT_PORT=1883
ENV OPENWEATHER_MQTT_TOPIC=openweather/current_weather

RUN echo "I am running on $BUILDPLATFORM, building for $TARGETPLATFORM"

WORKDIR /app
COPY root/app/* /app/
RUN npm install
CMD [ "node", "app.js" ]