const global = {
  currentPage: window.location.pathname,
  search:
  {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
  },
  api: 
  {
    apiKey: '545c25fa9359433e17dfb101843fd850',
    apiURL: 'https://api.themoviedb.org/3'
  },
};

console.log(global.currentPage);


// Function to get popular movies for homepage
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"/>`
            : `<img src="../images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"/>`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>
    `;

    document.querySelector('#popular-movies').appendChild(div); // Ensure this ID matches an element in your HTML
  });
}



// Removed redundant loop: This loop doesn't do anything meaningful
  // It tries to create new div elements and add classes but doesn't append them to the DOM
  /*
  results.forEach((movie) => {
    const div = document.createElement('div'); // Fixed typo: Changed "docuent" to "document"
    div.classList.add('card'); // Corrected syntax: should use the method properly
  });
  */


//from displaying popular movies, we are about to display popular show


async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((show) => {
    console.log(show);
    const div = document.createElement('div'); // Fixed typo: Changed "docuent" to "document"
    div.classList.add('card'); // Corrected syntax: replaced '=' with 'add' method
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}"
          class="card-img-top"
          alt="${show.title}"/>`
            : `<img src="../images/no-image.jpg"
          class="card-img-top"
          alt="${show.title}"/>`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${show.first_air_date}</small>
        </p>
      </div>
    `;

    document.querySelector('#popular-shows').appendChild(div); // Ensure this ID matches an element in your HTML
  });

  // Removed redundant loop: This loop doesn't do anything meaningful
  // It tries to create new div elements and add classes but doesn't append them to the DOM
  
 
  
 
}


//Function display movie details
async function displayMovieDetails()
{

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const movieId = urlParams.get('id');

  console.log('Movie ID:', movieId);  // Verifying the movie ID



  
  // console.log('Full URL:', window.location.href);
  // console.log('Search part:', window.location.search);
  
  //   const movieId = window.location.search.split('=')[1]
  //   console.log(movieId);


     if (!movieId) {
      console.error('No movie ID found in the URL.');
      document.querySelector('#movie-details').innerHTML = `<p>Movie not found. Please check the URL.</p>`;
      return;
    }

    const movie = await fetchAPIData(`movie/${movieId}`);

     if (!movie || movie.success === false) {
      console.error('Failed to fetch movie data:', movie ? movie.status_message : 'Unknown error');
      alert('Movie not found or invalid ID.');
      return;
     }
    console.log('Movie ID:', movieId);


   const div = document.createElement('div');

   div.innerHTML = 
   
   `
<div class="details-top">
    
     <div>
      ${
     movie.poster_path
       ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
     class="card-img-top"
     alt="${movie.title}"/>`
       : `<img src="../images/no-image.jpg"
     class="card-img-top"
     alt="${movie.title}"/>`
   }
     </div>
       <h2>${movie.title}</h2>
       <p>
         <i class="fas fa-star text-primary"></i>
       </p>
       <p class="text-muted">Release Date: ${movie.release_date}</p>
       <p>
         ${movie.overview}
       </p>
       <h5>Genres</h5>
       <ul class="list-group">
       ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}  
       >
       </ul>
       <a href="${movie.homepage}" target = "_blank" class ="btn">Visit Homepage</a>
      
     </div>
   </div>
   <div class="details-bottom">
     <h2>Movie Info</h2>
     <ul>
       <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
       <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
       <li><span class="text-secondary">Runtime:</span>${movie.runtime} minutes </li>
       <li><span class="text-secondary">Status:</span> ${movie.status}</li>
     </ul>
     <h4>Production Companies</h4>
     <div class="list-group">
     ${movie.production_companies.map((company) =>`<span>${company.name}</span>`).join(',')}
     </div>
   </div>

   `


  document.querySelector('#movie-details').appendChild(div);

}


//Function display show details
async function displayShowDetails()
{


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const showId = urlParams.get('id');

  console.log('Show ID:', showId);  // Verifying the show ID


  // console.log('Full URL:', window.location.href);
  // console.log('Search part:', window.location.search);
  
  //  const showId = window.location.search.split('=')[1]
  //   console.log(showId);

   const show = await fetchAPIData(`tv/${showId}`);
     console.log('Show ID:', showId);

     if (!showId) {
      console.error('No movie ID found in the URL.');
      document.querySelector('#show-details').innerHTML = `<p>Movie not found. Please check the URL.</p>`;
      return;
    }

    

   const div = document.createElement('div');

   div.innerHTML = 
   
   `
<div class="details-top">
    
     <div>
      ${
     show.poster_path
       ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}"
     class="card-img-top"
     alt="${show.name}"/>`
       : `<img src="../images/no-image.jpg"
     class="card-img-top"
     alt="${show.name}"/>`
   }
     </div>
       <h2>${show.name}</h2>
       <p>
         <i class="fas fa-star text-primary"></i>
         ${show.vote_average.toFixed(1)} / 10
       </p>
       <p class="text-muted">Last Air  Date: ${show.last_air_date}</p>
       <p>
         ${show.overview}
       </p>
       <h5>Genres</h5>
       <ul class="list-group">
       ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}  
       >
       </ul>
       <a href='${show.homepage}' class="btn">Visit Show  Homepage</a>
     </div>
   </div>
   <div class="details-bottom">
     <h2>Show Info</h2>
     <ul>
       <li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}}</li>
       <li><span class="text-secondary">Last episode to air:</span> ${show.last_episode_to_air}</li>
       <li><span class="text-secondary">Status:</span> ${show.status}</li>
     </ul>
     <h4>Production Companies</h4>
     <div class="list-group">
     ${show.production_companies.map((company) =>`<span>${company.name}</span>`).join(',')}
     </div>
   </div>

   `


  document.querySelector('#show-details').appendChild(div);

}


//Search Movies/Shows

async function Search()
{
  console.log('Search function is being called');
  // const queryString = window.location.search
  // console.log(queryString); 
  const queryString = window.location.search;
  console.log('Full URL:', window.location.href); // Log the full URL
  console.log('Query String:', queryString);

  const urlParams = new URLSearchParams(queryString);

  global.search.type=urlParams.get('type');

  global.search.term=urlParams.get('search-term');


  if (global.search.term !=='' && global.search.term !== null )
    {
      //-make requests and display results
      const {results, total_pages,page} = await searchAPIData();

      global.search.page = page;
      global.search.totalPages = total_pages
      console.log(page,total_pages);
      if(results.length === 0)
      {
        showAlert('No results found');
        return
      }
      // console.log(results);   


      displaySearchResults(results);

      document.querySelector('#search-term').value = ''
    }

    else
    {
      showAlert('Please enter the search items')
    }

}

function displaySearchResults(results)
{

  //Clear previous results
  document.querySelector('#search-results').innerHTML = ``
  document.querySelector('#pagination').innerHTML = ``
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${
          result.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"/>`
            : `<img src="../images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"/>`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
        </p>
      </div>
    `;

    document.querySelector('#search-results').appendChild(div); // Ensure this ID matches an element in your HTML
  });

  displayPagination();
}

//Create and Display pagination for search
function displayPagination()
{
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML =
  `
   <button class="btn btn-primary" id="prev">Prev</button>
   <button class="btn btn-primary" id="next">Next</button>
   <div class="page-counter">${global.search.page} of ${global.search.totalPages}</div>
      
  `;
  document.querySelector('#pagination').appendChild(div);

  //Disable prev button if on first page
  if(global.search.page === 1)
  {
    document.querySelector('#prev').disabled = true
  }

  //Disable the next button if on last page

  if(global.search.page === global.search.totalPages)
    {
      document.querySelector('#next').disabled = true
    }

    //Next Page
    document.querySelector('#next').addEventListener('click', async () =>
    {
      global.search.page++;
      const {results, total_pages} = await searchAPIData();
      displaySearchResults(results)
    })

    //Prev Page
    document.querySelector('#prev').addEventListener('click', async () =>
    {
      global.search.page--;
      const {results, total_pages} = await searchAPIData();
      displaySearchResults(results)
    })
}

//Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  const wrapper = document.querySelector('.swiper-wrapper');
  wrapper.innerHTML = '';

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i>
        ${movie.vote_average}/10
      </h4>
    `;

    wrapper.appendChild(div);
  });

  initSwiper();

  function initSwiper() {
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

//Display Show Slider

async function displayShowSlider() {
  const { results } = await fetchAPIData('tv/on_the_air');
  const wrapper = document.querySelector('#now-playing-shows');
  wrapper.innerHTML = '';

  if (!results || results.length === 0) {
    wrapper.innerHTML = '<p>No currently airing TV shows found.</p>';
    return;
  }

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

  initSwiper();

  function initSwiper() {
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


// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  // Ensure your API key is secured in a production environment
  // const API_KEY = '545c25fa9359433e17dfb101843fd850';
  // const API_URL = 'https://api.themoviedb.org/3';

  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner()
  // Fixed typo in the URL: Changed "$language" to "&language"
  const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`);

  const data = await response.json();

    
  hideSpinner()

  return data;


}

// Make request for search
async function searchAPIData() {
  // Ensure your API key is secured in a production environment
  // const API_KEY = '545c25fa9359433e17dfb101843fd850';
  // const API_URL = 'https://api.themoviedb.org/3';

  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner()
  // Fixed typo in the URL: Changed "$language" to "&language"
  const response = await fetch(`${API_URL}/search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

  //const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`);
   //type because it has to be movie type or show type

   //coding can be very funny sometimes.. sometimes just a backslash, a simple backslash can make a big difference
  const data = await response.json();

  hideSpinner()

  return data;


}

//Show  Alert

function showAlert(message, className)
{
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className)
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 2000)

}

//Showing and hiding the spinner
function showSpinner()
{
  document.querySelector('.spinner').classList.add('show')
}
function hideSpinner()
{
  document.querySelector('.spinner').classList.remove('show')
}


// Highlight active link
function HighlitActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}


function addCommasToNumber(number)
 {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");  //From stackoverflow
 }


// Initializing the app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
     
      displaySlider();
      displayPopularMovies(); // Ensure this function is called to populate the homepage
      break;

    case '/shows.html':
      //console.log('Shows');
      displayShowSlider()
      displayPopularShows()
      break;

    case '/movie-details.html':
      displayMovieDetails()
      break;

    case '/tv-details.html':
      displayShowDetails()
      break;
    case '/search.html':
      Search()
      break;
  }

  HighlitActiveLink(); // Ensures the active link is highlighted
}

document.addEventListener('DOMContentLoaded', init);













