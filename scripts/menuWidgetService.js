import { formatTemperature } from './helpers/formatTemperature.js';
import { formatPercent } from './helpers/formatPercent.js';
import { formatSpeed } from './helpers/formatSpeed.js';
import { formatTime } from './helpers/formatTime.js';
import { weatherConditionToIconMapper } from './helpers/mappers.js';
import { SECOND } from './constants.js';

function createMenuWidgetService() {
  function applyWeatherConditions(weatherConditions) {
    const weatherConditionsElement = document.querySelector('.menu__details-item-weather-conditions');

    if (!weatherConditionsElement) {
      throw new Error('Element with class "menu__details-item-weather-conditions" not found');
    }

    weatherConditionsElement.textContent = weatherConditions;
  }

  function applyWeatherDetails(weatherDetailsArr) {
    const weatherDetailsItemValues = document.querySelectorAll('.menu__details-item-value');

    if (!weatherDetailsItemValues) {
      throw new Error('Element with class "menu__details-item-value" not found');
    }
    
    weatherDetailsItemValues[0].textContent = formatTemperature(weatherDetailsArr[0]);
    weatherDetailsItemValues[1].textContent = formatTemperature(weatherDetailsArr[1]);
    weatherDetailsItemValues[2].textContent = formatPercent(weatherDetailsArr[2]);
    weatherDetailsItemValues[3].textContent = formatPercent(weatherDetailsArr[3]);
    weatherDetailsItemValues[4].textContent = formatSpeed(weatherDetailsArr[4]);
  }

  function applyWeatherForecast(forecast) {
    forecast.list.forEach(obj => {
      const forecastListElement = document.querySelector('.menu__forecast-list');
      const forecastCardTemplate = document.querySelector('#forecast-card-template');
      const forecastCard = forecastCardTemplate.content.cloneNode(true);
      const forecastListItem = forecastCard.querySelector('.menu__forecast-item');
      
      function applyIcon(iconCode) {
        const forecastCardIcon = forecastCard.querySelector('.forecast-card__icon');
  
        if (!iconCode) {
          throw new Error('Icon code is not defined');
        }
  
        forecastCardIcon.style.backgroundImage = `url(./assets/img/${weatherConditionToIconMapper(iconCode)}-icon.svg)`;
      }
  
      function applyTime(time) {
        const forecastCardTime = forecastCard.querySelector('.forecast-card__time');
  
        if (!time) {
          throw new Error('Time is not defined');
        }

        const now = new Date;
        const forecastTime = new Date(new Date(time * SECOND).getTime() + ((now.getTimezoneOffset() * 60) + forecast.city.timezone) * SECOND);
        
        forecastCardTime.textContent = formatTime(forecastTime.toLocaleTimeString({}, { hour: '2-digit' }));
      }
  
      function applyConditions(conditions) {
        const forecastCardConditions = forecastCard.querySelector('.forecast-card__conditions');
  
        if (!conditions) {
          throw new Error('Conditions is not defined');
        }
  
        forecastCardConditions.textContent = conditions;
      }
  
      function applyTemperature(temperature) {
        const forecastCardTemperature = forecastCard.querySelector('.forecast-card__temperature-value');
  
        if (!temperature) {
          throw new Error('Temperature is not defined');
        }
  
        forecastCardTemperature.textContent = formatTemperature(temperature);
      }

      applyIcon(obj.weather[0].icon);
      applyTime(obj.dt);
      applyConditions(obj.weather[0].description);
      applyTemperature(obj.main.temp);
  
      forecastListElement.insertAdjacentElement('beforeend', forecastListItem);
    });
  }

  async function process(weatherData, weatherForecast) {
    const weatherDetailsArr = [
      weatherData.main.temp_max,
      weatherData.main.temp_min,
      weatherData.main.humidity,
      weatherData.clouds.all,
      weatherData.wind.speed,
    ];

    applyWeatherConditions(weatherData.weather[0].description);
    applyWeatherDetails(weatherDetailsArr);
    applyWeatherForecast(weatherForecast);
  }

  return {
    process
  }
}

export const menuWidgetService = createMenuWidgetService();
