import { formatTemperature, weatherConditionToIconMapper } from './helpers/helperFunctions.js';
import { imageApiService } from './imageApiService.js';
import { Settings, SECOND } from './constants.js';

function createWeatherWidgetService() {
  async function getBackgroundImage(keywords) {
    const imageResponse = await imageApiService.fetchImageByKeywords(keywords);
    const imageUrl = Array.from(imageResponse.results).map(url => {
      const img = new Image();
      img.src = url.urls.regular;
      return img;
    });
    
    return imageUrl;
  }

  function applyBackgroundImage(url) {
    const backgroundElement = document.querySelector('#background');
    const slideShowBtn = document.querySelector('.main__slide-show-button');
    const isSlideShowRunning = JSON.parse(localStorage.getItem(Settings.isSlideShowRunning));

    let slideShow;
    let count = 1;
  
    if (!backgroundElement) {
      throw new Error('Element with id "background" not found');
    }
  
    backgroundElement.style.backgroundImage = `url(${url[0].src})`;

    function changeImage() {
      slideShowBtn.classList.toggle('main__slide-show-button--pause');
      
      if (slideShowBtn.classList.contains('main__slide-show-button--pause')) {
        slideShow = setInterval(() => {
          backgroundElement.style.backgroundImage = `url(${url[count].src})`;
          count = (count >= url.length - 1) ? 0 : ++count;
        }, 10000);
        
        localStorage.setItem(Settings.isSlideShowRunning, true);
      } else {
        clearInterval(slideShow);
        localStorage.setItem(Settings.isSlideShowRunning, false);
      }
    }

    slideShowBtn.addEventListener('click', changeImage);

    if (isSlideShowRunning) {
      slideShowBtn.click();
    }
  }

  function applyTemperature(temperature) {
    const temperatureElement = document.querySelector('.weather-widget__temperature-value');
  
    if (!temperatureElement) {
      throw new Error('Element with class "weather-widget__temperature-value" not found');
    }
  
    temperatureElement.textContent = temperature;
  }
  
  function applyLocation(city) {
    const locationElement = document.querySelector('.weather-widget__location-name');
  
    if (!locationElement) {
      throw new Error('Element with class "weather-widget__location-name" not found');
    }
  
    if (!city) {
      throw new Error('City is not defined');
    }
  
    locationElement.textContent = city;
  }
  
  function applyDate(currentDate, weatherData) {
    const dateElement = document.querySelector('.weather-widget__date-value');
    
    if (!dateElement) {
      throw new Error('Element with class "weather-widget__date-value" not found');
    }
  
    if (!(currentDate instanceof Date)) {
      throw new Error('Date is not defined');
    }

    currentDate.setSeconds(currentDate.getSeconds() + (currentDate.getTimezoneOffset() * 60) + weatherData.timezone);
  
    const time = currentDate.toLocaleTimeString({}, { hour: '2-digit', minute: '2-digit' });
    const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const date = currentDate.getDate();
    const month = currentDate.toLocaleDateString('en-US', { month: 'short' });
    const year = currentDate.toLocaleDateString('en-US', { year: '2-digit' });
  
    dateElement.textContent = `${time} - ${day}, ${date} ${month} ‘${year}`;
  }
  
  function applyIcon(iconCode) {
    const iconElement = document.querySelector('.weather-widget__icon');
  
    if (!iconElement) {
      throw new Error('Element with class "weather-widget__icon" not found');
    }
  
    if (!iconCode) {
      throw new Error('Icon code is not defined');
    }
    
    iconElement.style.backgroundImage = `url(./assets/img/${weatherConditionToIconMapper(iconCode)}-icon.svg)`;
  }

  async function process(weatherData) {
    const imageUrl = await getBackgroundImage(`${weatherData.name} landscape ${weatherData.weather[0].description}`);
  
    applyBackgroundImage(imageUrl);
    applyTemperature(formatTemperature(weatherData.main.temp));
    applyLocation(weatherData.name);
    applyDate(new Date(), weatherData);
    setInterval(() => {
      applyDate(new Date(), weatherData);
    }, SECOND);
    applyIcon(weatherData.weather[0].icon);
  }

  return {
    process
  }
}

export const weatherWidgetService = createWeatherWidgetService();
