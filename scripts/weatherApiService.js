import { API_URL, FORECAST_API_URL, API_KEY, UNITS } from './constants.js';
import { baseFetch } from './helpers/baseFetch.js';

function createWeatherApiService() {
  function getWeatherByCity(city) {
    return baseFetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=${UNITS}`);
  }
  
  function getWeatherByLocation(lat, lon) {
    return baseFetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`);
  }

  function getWeatherForecastByLocation(lat, lon) {
    return baseFetch(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&cnt=8&appid=${API_KEY}&units=${UNITS}`);
  }

  return {
    getWeatherByCity,
    getWeatherByLocation,
    getWeatherForecastByLocation,
  }
}

export const weatherApiService = createWeatherApiService();
