import { baseFetch } from "./helpers/baseFetch.js";
import { IMAGE_API_URL, IMAGE_API_ACCESS_KEY } from '../env.js'

function createImageApiService() {
  const URL = IMAGE_API_URL;
  const ACCESS_KEY = IMAGE_API_ACCESS_KEY;

  function fetchImageByKeywords(keywords) {
    return baseFetch(`${URL}?query=${keywords}&client_id=${ACCESS_KEY}`);
  }

  return {
    fetchImageByKeywords,
  };
}

export const imageApiService = createImageApiService();
