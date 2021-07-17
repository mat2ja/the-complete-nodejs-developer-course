const request = require('request');

const forecast = (long, lat, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${lat},${long}&limit=1`;
  request({ url, json: true }, (error, response, body) => {
    if (error) {
      callback('Unable to connect to weather service.');
    } else if (body.error && !body.success) {
      callback('Unable to find location.');
    } else {
      const {
        temperature,
        feelslike,
        weather_descriptions: [description],
      } = body.current;

      const forecastMsg = `${description}. It is currently ${temperature} degrees out. Feels like ${feelslike} degrees tho.`;
      callback(null, forecastMsg);
    }
  });
};

module.exports = forecast;
