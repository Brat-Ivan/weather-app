import { weatherApiService } from './weatherApiService.js';
import { DEFAULT_CITY, Settings } from './constants.js';
import { weatherWidgetService } from './weatherWidgetService.js'
import { fetchLocationNames } from './fetchLocationNames.js'
import { formatLocationName } from './helpers/formatLocationName.js'
import { menuWidgetService } from './menuWidgetService.js'

const getWeatherByLocationBtn = document.querySelector('#get-weather-by-location-button');

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
const searchLocationsList = document.querySelector('.search-form__search-locations-list');
const searchLocationsItemTemplate = document.querySelector('#search-locations-item-template');
const searchLocationsItemTitleTemplate = document.querySelector('#search-locations-item-title-template');
const searchLocationsItemTitle = searchLocationsItemTitleTemplate.content.querySelector('.search-form__search-locations-item');

let searchLocationsArr = [];
let savedLocationsArr = [];

async function processWidgetsServices(data) {
  await weatherWidgetService.process(data);
  
  weatherApiService.getWeatherForecastByLocation(data.coord.lat, data.coord.lon)
    .then(async forecast => {
      await menuWidgetService.process(data, forecast);
    });
}

async function processWeatherByLocation() {
  const onSuccessLocation = (position) => {
    localStorage.setItem(Settings.isLocationFeatureEnabled, true);

    weatherApiService.getWeatherByLocation(position.coords.latitude, position.coords.longitude)
      .then(async data => {
        await processWidgetsServices(data);
      });
  };
  
  const onErrorLocation = (error) => {
    localStorage.setItem(Settings.isLocationFeatureEnabled, false);
    alert('Не удалось получить местоположение. Разрешите доступ к геолокации');
    throw new Error(error);
  };

  navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation);
}

getWeatherByLocationBtn.addEventListener('click', async () => {
  await processWeatherByLocation();
  location.reload();
});

async function getLocationNames() {
  const searchInputValue = searchInput.value;

  if (searchInputValue) {
    const locationsData = await fetchLocationNames(searchInputValue);
    
    searchLocationsList.innerHTML = '';
    searchLocationsArr = [];
    
    if (locationsData.length) {
      locationsData.forEach(elem => {
        const currentSearchLocationsItem = searchLocationsItemTemplate.content.cloneNode(true);
        const searchLocationsItem = currentSearchLocationsItem.querySelector('.search-form__search-locations-item');
        const searchLocationsText = currentSearchLocationsItem.querySelector('.search-form__search-locations-text');
  
        searchLocationsArr.push(elem);
        searchLocationsText.textContent = elem.display_name;
        searchLocationsList.insertAdjacentElement('beforeend', searchLocationsItem);
      });
    }

    if (searchLocationsList.innerHTML) {
      searchLocationsList.classList.add('search-form__search-locations-list--visible');
    } else {
      searchLocationsList.classList.remove('search-form__search-locations-list--visible');
    }
  } else {
    searchLocationsList.classList.remove('search-form__search-locations-list--visible');
  }
}

searchInput.addEventListener('keyup', () => {
  if (searchInput.value) {
    getLocationNames();
  } else {
    getSavedLocations();
  }
});

searchInput.addEventListener('search', () => {
  if (!searchInput.value) {
    getSavedLocations();
  } else {
    searchLocationsList.classList.remove('search-form__search-locations-list--visible');
  }
});

function completeLocationName(e) {
  if (!e.target.classList.contains('search-form__search-locations-text')) return;

  searchInput.value = e.target.closest('.search-form__search-locations-text').textContent;
  searchLocationsList.classList.remove('search-form__search-locations-list--visible');
}

searchLocationsList.addEventListener('mousedown', completeLocationName);

async function getWeatherBySearchingLocation() {
  const searchInputValue = searchInput.value;
  let foundLocation;
  let foundLocationIndex;

  if (savedLocationsArr.some(elem => elem.name === searchInputValue)) {
    foundLocationIndex = savedLocationsArr.findIndex(elem => {
      return elem.name === searchInputValue;
    });

    foundLocation = savedLocationsArr[foundLocationIndex];
    localStorage.setItem('location', JSON.stringify({name: foundLocation.name, lat: foundLocation.lat, lon: foundLocation.lon}));
  } else if (searchLocationsArr.some(elem => elem.display_name === searchInputValue)) {
    foundLocationIndex = searchLocationsArr.findIndex(elem => {
      return elem.display_name === searchInputValue;
    });

    foundLocation = searchLocationsArr[foundLocationIndex];
    localStorage.setItem('location', JSON.stringify({name: foundLocation.display_name, lat: foundLocation.lat, lon: foundLocation.lon}));
  } else {
    localStorage.setItem('location', JSON.stringify(searchInputValue));
  }
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  getWeatherBySearchingLocation();
  location.reload();
});

function savingLocation(data) {
  let savedLocations = JSON.parse(localStorage.getItem('saved_locations')) || [];
  let newLocation;

  if (typeof data !== 'string') {
    newLocation = {
      name: data.name,
      lat: data.lat,
      lon: data.lon,
    }

    savedLocations = savedLocations.filter(elem => {
      return elem.name !== newLocation.name;
    });
  } else {
    newLocation = data;

    savedLocations = savedLocations.filter(elem => {
      return elem !== newLocation;
    });
  }

  if (savedLocations.length >= 10) {
    savedLocations.pop();
  }

  savedLocations.unshift(newLocation);
  localStorage.setItem('saved_locations', JSON.stringify(savedLocations));
}

function getSavedLocations() {
  const savedLocationsData = JSON.parse(localStorage.getItem('saved_locations')) || [];

  searchLocationsList.innerHTML = '';
  searchLocationsList.insertAdjacentElement('afterbegin', searchLocationsItemTitle);

  savedLocationsData.forEach(elem => {
    const currentSearchLocationsItem = searchLocationsItemTemplate.content.cloneNode(true);
    const searchLocationsItem = currentSearchLocationsItem.querySelector('.search-form__search-locations-item');
    const searchLocationsText = currentSearchLocationsItem.querySelector('.search-form__search-locations-text');

    savedLocationsArr.push(elem);
    searchLocationsText.textContent = elem.name || elem;
    searchLocationsList.insertAdjacentElement('beforeend', searchLocationsItem);
  });
  
  if (savedLocationsData.length) {
    searchLocationsList.classList.add('search-form__search-locations-list--visible');
  }
}

searchInput.addEventListener('focus', () => {
  if (!searchInput.value) getSavedLocations();
});

searchInput.addEventListener('blur', () => {
  searchLocationsList.classList.remove('search-form__search-locations-list--visible');
});

async function app() {
  const isLocationFeatureEnabled = JSON.parse(localStorage.getItem(Settings.isLocationFeatureEnabled));
  let locationData = JSON.parse(localStorage.getItem('location'));

  if (locationData) {
    let weatherData;

    if (typeof locationData === 'string') {
      locationData = formatLocationName(locationData);
      weatherData = await weatherApiService.getWeatherByCity(locationData);

      if (weatherData.cod === '404') {
        alert(`Локация "${locationData}" не найдена`);
        weatherData = await weatherApiService.getWeatherByCity(DEFAULT_CITY);
      } else {
        savingLocation(locationData);
      }
    } else {
      weatherData = await weatherApiService.getWeatherByLocation(locationData.lat, locationData.lon);
      savingLocation(locationData);
    }

    processWidgetsServices(weatherData);
    localStorage.removeItem('location');
  } else if (isLocationFeatureEnabled) {
    processWeatherByLocation();
  } else {
    const weatherData = await weatherApiService.getWeatherByCity(DEFAULT_CITY);

    processWidgetsServices(weatherData);
  }
}

app();
