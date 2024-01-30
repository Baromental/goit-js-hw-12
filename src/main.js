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
let totalHits = 0;

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

  page = 1;
  showLoadingIndicator();
  clearGallery();

  try {
    const responseData = await fetchImages();
    if (responseData.hits.length === 0) {
      handleNoResults();
    } else {
      totalHits = responseData.totalHits;
      updateGallery(responseData.hits);
      showLoadMoreButton(responseData.hits.length);
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

async function handleLoadMore() {
  page += 1;
  showLoadingIndicator();

  fetchImages()
    .then((responseData) => {
      if (responseData.hits.length === 0) {
        handleNoResults();
      } else {
        totalHits = responseData.totalHits;
        updateGallery(responseData.hits);
        showLoadMoreButton(responseData.hits.length);
        smoothScrollToGallery(responseData.hits.length);
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

function showLoadMoreButton(imagesCount) {
  if (totalHits > page * 40 && imagesCount > 0) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    if (totalHits <= page * 40) {
      iziToast.show({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        backgroundColor: '#03a9f4',
        titleColor: '#FFFFFF',
        messageColor: '#FFFFFF',
      });
    }
  }
}

function smoothScrollToGallery(imagesCount) {
  const galleryItemHeight = document.querySelector('.gallery-item').getBoundingClientRect().height;

  window.scrollBy({
    top: galleryItemHeight * Math.min(2, imagesCount),
    behavior: 'smooth',
  });
}

function fetchImages() {
  const perPage = 40;
  return axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      searchTerm
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  ).then(response => response.data);
}

function showLoadingIndicator() {
  loadingIndicator.classList.remove('hidden');
}

function hideLoadingIndicator() {
  loadingIndicator.classList.add('hidden');
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

    const imageDesc = document.createElement('ul');
    imageDesc.classList.add('image-desc');

    const likesDesc = document.createElement('li');
    likesDesc.classList.add('image-desc-item');
    likesDesc.innerHTML = `<p>Likes</p><p>${image.likes}</p>`;

    const viewsDesc = document.createElement('li');
    viewsDesc.classList.add('image-desc-item');
    viewsDesc.innerHTML = `<p>Views</p><p>${image.views}</p>`;

    const commentsDesc = document.createElement('li');
    commentsDesc.classList.add('image-desc-item');
    commentsDesc.innerHTML = `<p>Comments</p><p>${image.comments}</p>`;

    const downloadsDesc = document.createElement('li');
    downloadsDesc.classList.add('image-desc-item');
    downloadsDesc.innerHTML = `<p>Downloads</p><p>${image.downloads}</p>`;

    imageDesc.appendChild(likesDesc);
    imageDesc.appendChild(viewsDesc);
    imageDesc.appendChild(commentsDesc);
    imageDesc.appendChild(downloadsDesc);

    imageLink.appendChild(imageElement);
    galleryItem.appendChild(imageLink);
    galleryItem.appendChild(imageDesc);

    galleryContainer.appendChild(galleryItem);
  });

  lightbox.refresh();
}
