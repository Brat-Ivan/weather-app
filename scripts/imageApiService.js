import { baseFetch } from "./helpers/baseFetch.js";
import { IMAGE_API_URL, IMAGE_API_ACCESS_KEY } from '../env.js';

function createImageApiService() {
  function fetchImageByKeywords(keywords) {
    return baseFetch(`${IMAGE_API_URL}?query=${keywords}&client_id=${IMAGE_API_ACCESS_KEY}`);
  }

  return {
    fetchImageByKeywords,
  };
}

export const imageApiService = createImageApiService();
