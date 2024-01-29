import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const apiKey = '42006022-41a20d969efbb704c546dcbcd';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loadingIndicator = document.getElementById('loading-indicator');
const galleryContainer = document.getElementById('gallery-container');

searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
    });
    return;
  }

  showLoadingIndicator();
  clearGallery();

  fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&safesearch=true`)
    .then(response => response.json())
    .then(responseData => {
      if (responseData.hits.length === 0) {
        iziToast.info({
          message: 'Sorry, there are no images matching your search query. Please try again.',
          position: 'topRight',
          color: '#EF4040',
          progressBarColor: '#B51B1B',
          messageColor: '#FAFAFB',
          icon: './img/bi_x-octagon.svg',
        });
      } else {
        updateGallery(responseData.hits);
      }

      hideLoadingIndicator();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      iziToast.error({
        title: 'Error',
        message: 'An error occurred while fetching data. Please try again.',
      });
      hideLoadingIndicator();
    });
}

function showLoadingIndicator() {
  loadingIndicator.classList.remove('hidden');
}

function hideLoadingIndicator() {
  loadingIndicator.classList.add('hidden');
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