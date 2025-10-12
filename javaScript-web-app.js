/* This is the URL for TMDb's "Discover Movies" API. 
   Fetches the movies sorted by popularity, in descending order */ 
const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0cec74559973c77aa1ad5ebabb957d6b&page=1";
// URL for the movie posters */
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
// URL for searching movies by query text */
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=0cec74559973c77aa1ad5ebabb957d6b&query=";
// URL for searching for tv shows
const SEARCHTV = "https://api.themoviedb.org/3/search/tv?api_key=0cec74559973c77aa1ad5ebabb957d6b&query=";
// URL for TV shows
const TV_APILINK = "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=0cec74559973c77aa1ad5ebabb957d6b&page=1";


// References to elements
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const returnToMain = document.getElementsByClassName("logo")[0];
const type = document.getElementById("type");

// Store the user's last search
let lastSearch = null;

/* Calls the returnResults function,
   so popular movies and tv shows will be displayed on page load */
returnResults(APILINK, "Popular Movies Today");
returnResults(TV_APILINK, "Popular TV Shows Today");

function returnResults(url, innerText2){
    // Sends a request to the API URL
    fetch(url).then(res => res.json())
    // Creates a 'h2' heading and appends it to main
    .then(function(data){
        const heading = document.createElement('h2');
        heading.innerText = innerText2;
        heading.setAttribute('id', 'heading');
        main.appendChild(heading);
        /* Array of movies returned by the movie API,
           and Loops through each movie within the array */
           
        data.results.forEach(element =>{
            // Creates a layout for the movie posters titles
            const div_card = document.createElement('div');
            div_card.setAttribute('class','card');
            div_card.classList.add('clickableCard');

            // Add type and id so we know what was clicked
            div_card.dataset.id = element.id;
            if(element.title){
                div_card.dataset.type = "movie";
            } else{
                div_card.dataset.type = "tv";
            }

            const div_row = document.createElement('div');
            div_row.setAttribute('class','row');
            const div_column = document.createElement('div');
            div_column.setAttribute('class','column');
            // Creates an 'img' element for the movie poster 
            const image = document.createElement('img');
            image.setAttribute('class','thumbnail');
            image.setAttribute('id','image');
            //Creates a 'h3' for the movie title
            const title = document.createElement('h3');
            title.classList.add('title');
            /* Uses the movie title if it exists; otherwise, 
               uses the TV show name */
            const titleText = element.title || element.name;
            title.innerHTML = titleText;
            /* Wraps the image in a '<center>' element, as well as setting up
               the title text and poster source image*/
            const center = document.createElement('center');

            image.src = IMG_PATH + element.poster_path;
            center.appendChild(image);
            /* Appends the image and title to the card, card to column, column to row, 
               and row to the main section */
            div_card.appendChild(center);
            div_card.appendChild(title);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);
            main.appendChild(div_row);

            // When a card is clicked, show details
            div_card.addEventListener('click', () => {
                showDetails(element.id, div_card.dataset.type);
            })
        });
    });
}

/* Function to return details of movies/tv shows; 
   'id' is the unique ID for the selected movie or TV show, and 
   'type' tells where its "movie" or "tv" */
function showDetails(id, type){
    // Clear resluts
    main.innerHTML = '';
    // Get details and credits 
    const DETAILS_URL = `https://api.themoviedb.org/3/${type}/${id}?api_key=0cec74559973c77aa1ad5ebabb957d6b&language=en-US`;
    const CREDITS_URL = `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=0cec74559973c77aa1ad5ebabb957d6b&language=en-US`;
    // Sends two fetch requests simultaneously, one for details; one for credits
    Promise.all([fetch(DETAILS_URL), fetch(CREDITS_URL)])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([details, credits]) => {
            /* Take the credits.cast array. Uses '.slice(0,5) to keep the first five actors'. 
               Then the names of each actor is extracted via '.map(actor => actor.name)'.
               Finally, uses '.join(', ')' to turn the array into a readable string. */
            const cast = credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
            // Create a new div that will hold all the detai;ed movie/show info
            const container = document.createElement('div');
            container.classList.add('details-container');
            // Details of the movie/poster
            container.innerHTML = `
                <h2 id="details-title">
                    ${details.title || details.name}
                </h2>
                <img class="details-poster" src="${IMG_PATH + details.poster_path}" alt="${details.title || details.name}">
                <p><strong>Rating:</strong> ⭐ ${details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}</p>
                <p><strong>Release Date:</strong> ${details.release_date || details.first_air_date || 'N/A'}</p>
                <p><strong>Overview:</strong> ${details.overview || 'No description available.'}</p>
                <p><strong>Cast:</strong> ${cast || 'No cast information available.'}</p>
                <button id="back-button">
                    ← Return
                </button>`;
            main.appendChild(container);
            // Handle Return button
            document.getElementById('back-button').addEventListener('click', () => {
                // Clear apge
                main.innerHTML = '';
                // Check if user has searched for something
                if(lastSearch){
                    /* Return user to their previous page - they won't be returned to the main page,
                       but rather their last search */
                    if(lastSearch.type === 'movie'){
                        returnResults(SEARCHAPI + lastSearch.query, "Search Results");
                    } else{
                        returnResults(SEARCHTV + lastSearch.query, "Search Results");
                    }
                } else{
                    // If they have no 'last Search', return to main page
                    returnResults(APILINK, "Popular Movies Today");
                    returnResults(TV_APILINK, "Popular TV Shows Today");
                }
            });
        })
}

/* Listens for a form submission.  If detected, it clears the current
   movie display and gets the search query, as well as, calling 'returnResults'
   to return the movies/tv shows  that fit the query submission.
   Lastly, it clears the input field */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = '';
    // Gets the text entered by the user in the search input
    const searchItem = search.value;
    // Gets the selected option from the dropddown (either "tv" or "movie")
    const selectedType = type.value;
    // Only proceeds if user selected "movie"
    if (searchItem){
        // Save the users search for back nav
        lastSearch = {
            query: searchItem,
            type: selectedType
        };
        if(selectedType === "movie"){
            /* Calls the 'returnResults' function with the movie search URL and heading. 
               Returns all the movies that match the query */
            returnResults(SEARCHAPI + searchItem, "Search Results");
        } else if (selectedType === "tv"){
            // Returns the tv shows that match the query
            returnResults(SEARCHTV + searchItem, "Search Results");
        }
        search.value = '';
    }
})

/* When the logo is clicked, it clears the main section, and returns to the default page,
   i.e. it reloads popular movies by calling returnResults(APILINK). Useful if user wants to return to main page, 
   after a search query */
returnToMain.addEventListener("click", (e) => {
    e.preventDefault();
    main.innerHTML = '';
    returnResults(APILINK, "Popular Movies Today");
    returnResults(TV_APILINK, "Popular TV Shows Today");
});