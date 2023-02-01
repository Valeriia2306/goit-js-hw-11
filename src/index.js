import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import NewApiService from './piaxabay';
import { refs } from './refs';
import { renderCards } from './renderCards';

const apiService = new NewApiService();
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);
refs.loadMoreButton.classList.add('hidden');

async function onSearch(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value.trim();

  if (inputValue === '') {
    return;
  }
  refs.loadMoreButton.classList.add('hidden');
  refs.gallery.innerHTML = '';
  apiService.search = inputValue;
  apiService.resetPage();

  try {
    const images = await apiService.fetchImages();
    apiService.counterImages = images.hits.length;

    if (apiService.counterImages === 0) {
      return Notiflix.Notify.failure('Nothing was found for your request');
    }

    if (apiService.counterImages > 40) {
      refs.loadMoreButton.classList.remove('hidden');
    }

    Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);

    renderCards(images.hits);
    simpleLightbox.refresh();
    refs.loadMoreButton.classList.remove('hidden');
  } catch (error) {
    console.log(error.message);
  }
}
// Function on Load
async function onLoadMore() {
  apiService.incrementPage();
  try {
    const images = await apiService.fetchImages();
    apiService.counterImages += images.hits.length;
    if (apiService.counterImages === images.totalHits) {
      refs.loadMoreButton.classList.add('hidden');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    renderCards(images.hits);
    simpleLightbox.refresh();
  } catch (error) {
    refs.loadMoreButton.classList.add('hidden');
    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
