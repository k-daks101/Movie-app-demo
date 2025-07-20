const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: '545c25fa9359433e17dfb101843fd850',
    apiURL: 'https://api.themoviedb.org/3'
  },
};

console.log(global.currentPage);

// Fetch API data
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();
  const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  hideSpinner();
  return data;
}

// Spinner controls
function showSpinner() {
  document.querySelector('.spinner')?.classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner')?.classList.remove('show');
}

// Display popular TV shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  const container = document.querySelector('#popular-shows');
  if (!container) return;

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text"><small class="text-muted">First Air Date: ${show.first_air_date}</small></p>
      </div>
    `;
    container.appendChild(div);
  });
}

// Display shows currently airing
async function displayShowSlider() {
  const { results } = await fetchAPIData('tv/on_the_air');
  const wrapper = document.querySelector('#now-playing-shows');
  if (!wrapper) return;

  wrapper.innerHTML = '';
  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        <img src="${show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'images/no-image.jpg'}" alt="${show.name}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i>
        ${show.vote_average?.toFixed(1) ?? 'N/A'}/10
      </h4>
    `;
    wrapper.appendChild(div);
  });

  if (document.querySelector('.swiper')) {
    new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}

// Highlight active nav link
function HighlitActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Init function
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayShowSlider();
      displayPopularShows();
      break;
    // ... Add other cases as needed
  }

  HighlitActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
