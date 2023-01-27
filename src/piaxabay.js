import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33063383-bd6e409d61d5c48ff9c16732f';
// Class NewApi
export default class NewApiService {
  constructor() {
    this._search = '';
    this.page = 1;
    this.counterImages = 0;
  }

  async fetchImages() {
    const searchParameters = new URLSearchParams({
      key: API_KEY,
      q: this._search,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 20,
    });
    const url = `${BASE_URL}?${searchParameters}`;

    const response = await axios.get(url);

    return await response.data;
  }

  get search() {
    return this._search;
  }

  set search(newSearch) {
    this._search = newSearch;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
