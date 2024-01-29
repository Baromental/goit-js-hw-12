import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const apiKey = '42006022-41a20d969efbb704c546dcbcd';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loadingIndicator = document.getElementById('loading-indicator');
const galleryContainer = document.getElementById('gallery-container');
const loadMoreBtn = document.getElementById('load-more');
let searchTerm = '';
let page = 1;

searchForm.addEventListener('submit', handleSearch);

loadMoreBtn.innerText = 'Load more';
loadMoreBtn.classList.add('hidden');
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();
  searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
    });
    return;
  }

  page = 1; // Reset page number on new search
  showLoadingIndicator();
  clearGallery();

  try {
    const responseData = await fetchImages();
    if (responseData.hits.length === 0) {
      // Handle case when there are no results
      handleNoResults();
    } else {
      updateGallery(responseData.hits);
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching data. Please try again.',
    });
  } finally {
    hideLoadingIndicator();
  }
}

async function fetchImages() {
  const perPage = 40;
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      searchTerm
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}

function showLoadingIndicator() {
  loadingIndicator.classList.remove('hidden');
}

function hideLoadingIndicator() {
  loadingIndicator.classList.add('hidden');
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function handleNoResults() {
  iziToast.info({
    message: 'Sorry, there are no images matching your search query. Please try again.',
    position: 'topRight',
    color: '#EF4040',
    progressBarColor: '#B51B1B',
    messageColor: '#FAFAFB',
    icon: './img/bi_x-octagon.svg',
  });
}

function handleLoadMore() {
  page += 1;
  showLoadingIndicator();

  fetchImages()
    .then((responseData) => {
      if (responseData.hits.length === 0) {
        handleNoResults();
      } else {
        updateGallery(responseData.hits);
        smoothScrollToGallery();
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      iziToast.error({
        title: 'Error',
        message: 'An error occurred while fetching data. Please try again.',
      });
    })
    .finally(() => {
      hideLoadingIndicator();
    });
}

function smoothScrollToGallery() {
  const galleryHeight = document.querySelector('.gallery-item').getBoundingClientRect().height;
  window.scrollBy({
    top: galleryHeight * 2, // Scroll by two heights of a gallery item
    behavior: 'smooth',
  });
}

function clearGallery() {
  galleryContainer.innerHTML = '';
}

function updateGallery(images) {
  const lightbox = new SimpleLightbox('.gallery-item a');

  images.forEach((image) => {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');

    const imageLink = document.createElement('a');
    imageLink.href = image.largeImageURL;

    const imageElement = document.createElement('img');
    imageElement.src = image.webformatURL;
    imageElement.alt = image.tags;
    imageElement.title = image.tags;

    imageLink.appendChild(imageElement);
    galleryItem.appendChild(imageLink);

    galleryContainer.appendChild(galleryItem);
  });

  lightbox.refresh();
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}
