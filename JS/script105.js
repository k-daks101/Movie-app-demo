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
    apiURL: 'https://api.themoviedb.org/3',
  },
};

document.addEventListener('DOMContentLoaded', init);

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
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      Search();
      break;
  }

  highlightActiveLink();
}

// ===================
// API HELPERS
// ===================

async function fetchAPIData(endpoint) {
  showSpinner();
  const response = await fetch(`${global.api.apiURL}/${endpoint}?api_key=${global.api.apiKey}&language=en-US`);
  const data = await response.json();
  hideSpinner();
  return data;
}

async function searchAPIData() {
  showSpinner();
  const response = await fetch(
    `${global.api.apiURL}/search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// ===================
// SLIDERS
// ===================

async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  const wrapper = document.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = '';
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="${getPoster(movie.poster_path)}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)}/10
      </h4>
    `;
    wrapper.appendChild(div);
  });

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

async function displayShowSlider() {
  const { results } = await fetchAPIData('tv/on_the_air');
  const wrapper = document.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = '';
  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        <img src="${getPoster(show.poster_path)}" alt="${show.name}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${show.vote_average?.toFixed(1) ?? 'N/A'}/10
      </h4>
    `;
    wrapper.appendChild(div);
  });

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

// ===================
// MOVIES & SHOWS
// ===================

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  const container = document.querySelector('#popular-movies');
  if (!container) return;

  container.innerHTML = '';
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="${getPoster(movie.poster_path)}" class="card-img-top" alt="${movie.title}" />
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text"><small class="text-muted">Release: ${movie.release_date}</small></p>
      </div>
    `;
    container.appendChild(div);
  });
}

async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  const container = document.querySelector('#popular-shows');
  if (!container) return;

  console.log(results); // ✅ Show TV show data in console

  container.innerHTML = '';
  results.forEach((show) => {
    console.log(show.name, show.poster_path); // ✅ Optional: log show name and poster

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        <img src="${getPoster(show.poster_path)}" class="card-img-top" alt="${show.name}" />
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text"><small class="text-muted">Aired: ${show.first_air_date || 'N/A'}</small></p>
      </div>
    `;
    container.appendChild(div);
  });
}

// ===================
// DETAILS
// ===================

async function displayMovieDetails() {
  const movieId = new URLSearchParams(window.location.search).get('id');
  if (!movieId) return;

  const movie = await fetchAPIData(`movie/${movieId}`);
  const container = document.querySelector('#movie-details');
  if (!container) return;

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
      <div>
        <img src="${getPoster(movie.poster_path)}" class="card-img-top" alt="${movie.title}" />
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p><i class="fas fa-star text-primary"></i> ${movie.vote_average}/10</p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>${movie.overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">${movie.genres.map(g => `<li>${g.name}</li>`).join('')}</ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div>${movie.production_companies.map(c => `<span>${c.name}</span>`).join(', ')}</div>
    </div>
  `;
  container.appendChild(div);
}

async function displayShowDetails() {
  const showId = new URLSearchParams(window.location.search).get('id');
  if (!showId) return;

  const show = await fetchAPIData(`tv/${showId}`);
  const container = document.querySelector('#show-details');
  if (!container) return;

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
      <div>
        <img src="${getPoster(show.poster_path)}" class="card-img-top" alt="${show.name}" />
      </div>
      <div>
        <h2>${show.name}</h2>
        <p><i class="fas fa-star text-primary"></i> ${show.vote_average}/10</p>
        <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
        <p>${show.overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">${show.genres.map(g => `<li>${g.name}</li>`).join('')}</ul>
        <a href="${show.homepage}" target="_blank" class="btn">Visit Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Episodes:</span> ${show.number_of_episodes}</li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div>${show.production_companies.map(c => `<span>${c.name}</span>`).join(', ')}</div>
    </div>
  `;
  container.appendChild(div);
}

// ===================
// SEARCH
// ===================

async function Search() {
  const urlParams = new URLSearchParams(window.location.search);
  global.search.term = urlParams.get('search-term');
  global.search.type = urlParams.get('type');

  if (!global.search.term) {
    showAlert('Please enter a search term');
    return;
  }

  const { results, page, total_pages } = await searchAPIData();
  global.search.page = page;
  global.search.totalPages = total_pages;

  if (results.length === 0) {
    showAlert('No results found');
    return;
  }

  displaySearchResults(results);
  document.querySelector('#search-term').value = '';
}

function displaySearchResults(results) {
  const container = document.querySelector('#search-results');
  container.innerHTML = '';
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
        <img src="${getPoster(result.poster_path)}" class="card-img-top" alt="${result.name || result.title}" />
      </a>
      <div class="card-body">
        <h5 class="card-title">${result.name || result.title}</h5>
        <p class="card-text"><small class="text-muted">Release: ${result.first_air_date || result.release_date}</small></p>
      </div>
    `;
    container.appendChild(div);
  });
}

// ===================
// UTILS
// ===================

function getPoster(posterPath) {
  return posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'images/no-image.jpg';
}

function showSpinner() {
  document.querySelector('.spinner')?.classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner')?.classList.remove('show');
}

function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

function showAlert(message) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert');
  alertEl.textContent = message;
  document.querySelector('#alert')?.appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
