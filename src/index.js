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
refs.loadMoreButton.addEventListener('onClick', onLoadMore);
refs.loadMoreButton.classList.add('hidden');

async function onSearch(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value.trim();

  if (inputValue === '') {
    return;
  }

  refs.gallery.innerHTML = '';
  apiService.search = inputValue;
  apiService.resetPage();

  try {
    const images = await apiService.fetchImages();
    apiService.counterImages = images.hits.length;

    if (apiService.counterImages < 20) {
      refs.loadMoreButton.classList.add('hidden');
    }
    if (apiService.counterImages === 0) {
      return Notiflix.Notify.failure('Nothing was found for your request');
    }

    Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);

    await renderCards(images.hits);
    simpleLightbox.refresh();
    refs.loadMoreButton.classList.remove('hidden');
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  apiService.incrementPage();
  try {
    const images = await apiService.fetchImg();
    apiService.counterImages += images.hits.length;
    if (apiService.counterImages === images.totalHits) {
      refs.loadMoreButton.classList.add('hidden');
      return Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    await renderCards(images.hits);
    await simpleLightbox.refresh();
  } catch (error) {
    refs.loadMoreButton.classList.add('hidden');
    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

const options = {
  rootMargin: '100px',
};

const loadMore = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    }
  });
};
const observer = new IntersectionObserver(loadMore, options);
observer.observe(refs.loadMoreButton);
