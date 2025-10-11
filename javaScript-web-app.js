/* This is the URL for TMDb's "Discover Movies" API. 
   Fetches the movies sorted my popularity, in descending order */ 
const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0cec74559973c77aa1ad5ebabb957d6b&page=1";
// URL for the movie posters */
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
// URL for searching movies by query text */
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=0cec74559973c77aa1ad5ebabb957d6b&query=";

// References to elements
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const returnToMain = document.getElementsByClassName("logo")[0];

/* Calls the returnMovies function,
   so popular movies will be displayed on page load */
returnMovies(APILINK, "Popular Movies Today");
function returnMovies(url, innerText2){
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
        console.log(data.results);
        data.results.forEach(element =>{
            // Creates a layout for the movie posters titles
            const div_card = document.createElement('div');
            div_card.setAttribute('class','card');
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
            title.setAttribute('id','title');
            title.classList.add('clickableTitle');
            title.textContent = element.title;
            //Checks to see if the movie title is clicked
            title.addEventListener('click', () =>{
                main.innerHTML = '';
            })
            /* Wraps the image in a '<center>' element, as well as setting up
               the title text and poster source image*/
            const center = document.createElement('center');
            title.innerHTML = `${element.title}`;
            image.src = IMG_PATH + element.poster_path;
            center.appendChild(image);
            /* Appends the image and title to the card, card to column, column to row, 
               and row to the main section */
            div_card.appendChild(center);
            div_card.appendChild(title);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);
            main.appendChild(div_row);
        });
    });
}

/* Listens for a form submission, i.e. a movie query. If detected,
   it clears the current movie display and gets the search query, as well as, calling 'returnMovies'
   to return the movies that fit the query submission. Lastly, it clears the input field */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = '';
    const searchItem = search.value;
    if (searchItem){
        returnMovies(SEARCHAPI + searchItem, "Search Results");
        search.value = '';
    }
})

/* When the logo is clicked, it clears the main section, and returns to the default page,
   i.e. it reloads popular movies by calling returnMovies(APILINK). Useful if user wants to return to main page, 
   after a search query */
returnToMain.addEventListener("click", (e) => {
    e.preventDefault();
    main.innerHTML = '';
    returnMovies(APILINK, "Popular Today");
});