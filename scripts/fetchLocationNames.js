import { baseFetch } from './helpers/baseFetch.js';
import { LOCATIONS_API_URL } from '../env.js';

export const fetchLocationNames = (city) => {
  const URL = LOCATIONS_API_URL;
  
  return baseFetch(`${URL}?city=${city}&format=json`);
}
