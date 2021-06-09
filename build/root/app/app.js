const process = require('process');
const env=process.env;
const https = require('https');
const mqtt = require('mqtt');
const CronJob = require('cron').CronJob;
const mqttClient = mqtt.connect('mqtt://' + env.OPENWEATHER_MQTT_HOST + ':' + env.OPENWEATHER_MQTT_PORT);
const pm2 = require('pm2');

process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})

pm2.launchBus((err, bus) => {
    console.log('connected', bus);

    bus.on('process:exception', function(data) {
      console.log(arguments);
    });

    bus.on('log:err', function(data) {
      console.log('logged error',arguments);
    });

    bus.on('reconnect attempt', function() {
      console.log('Bus reconnecting');
    });

    bus.on('close', function() {
      console.log('Bus closed');
    });
});

mqttClient.on('connect', () => {
    console.log("Connected!");

    const http_options = {
      hostname: `${env.OPENWEATHER_API_URL}`,
      port: 443,
      path: `/data/2.5/weather?q=${env.OPENWEATHER_CITY}&appid=${env.OPENWEATHER_API_KEY}&units=${env.OPENWEATHER_UNITS}&lang=${env.OPENWEATHER_LANG}`,
      //path: `/data/2.5/weather?lat=${env.OPENWEATHER_LATITUDE}&lon=${env.OPENWEATHER_LONGITUDE}&appid=${env.OPENWEATHER_API_KEY}&units=${env.OPENWEATHER_UNITS}&lang=${env.OPENWEATHER_LANG}`,
      method: 'GET'
    }

    const job = new CronJob(env.OPENWEATHER_CRON_SCHEDULE, function() {
        const req = https.request(http_options, res => {
            //console.log(`statusCode: ${res.statusCode}`);
            //console.log(http_options.path);
            res.on('data', d => {
                process.stdout.write(d)
                mqttClient.publish(env.OPENWEATHER_MQTT_TOPIC, d);
            });
        })

        req.on('error', error => {
            console.error(error)
        })

        req.end();
    }, null, true, env.OPENWEATHER_CRON_TIMEZONE);
    job.start();
});