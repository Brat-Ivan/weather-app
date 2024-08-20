const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

function createEnvFile() {
  const envConfigFile = `
  export const WEATHER_API_URL = "${process.env.WEATHER_API_URL}";
  export const WEATHER_FORECAST_API_URL = "${process.env.WEATHER_FORECAST_API_URL}";
  export const WEATHER_API_KEY = "${process.env.WEATHER_API_KEY}";
  export const IMAGE_API_URL = "${process.env.IMAGE_API_URL}";
  export const IMAGE_API_ACCESS_KEY = "${process.env.IMAGE_API_ACCESS_KEY}";
  export const LOCATIONS_API_URL = "${process.env.LOCATIONS_API_URL}";
  `;

  fs.writeFileSync('./env.js', envConfigFile);
}

createEnvFile();
