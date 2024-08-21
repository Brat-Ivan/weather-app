import { baseFetch } from './helpers/baseFetch.js';
import { LOCATIONS_API_URL } from '../env.js';

export const fetchLocationNames = (city) => {
  return baseFetch(`${LOCATIONS_API_URL}?city=${city}&format=json`);
};
