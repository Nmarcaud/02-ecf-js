// Search Form
const searchForm = document.querySelector('#search-form');
const searchField = document.querySelector("#search-field");
const categoryField = document.querySelector("#category-search-field");

const searchHelpers = document.querySelector('#search-helpers');

const searchResults = document.querySelector('#search-results');
const loading =  document.querySelector('#loading');


// Nombre de résultats
const nbResults = document.querySelector("#nb-results");

// Gestion Modal
const infoModal = new bootstrap.Modal(document.querySelector("#info-modal"));
// Modal
const modalTitle = document.querySelector('.modal-title');
const modalSongTitle = document.querySelector('#song-title');
const modalSongArtist = document.querySelector('#song-artist');
const modalSongAlbum = document.querySelector('#song-album');
const modalSongGenres = document.querySelector('#song-genres');
const modalSongLength = document.querySelector('#song-length');
const modalSongRate = document.querySelector('#song-rate');
const coverArts = document.querySelector('#cover-arts');


searchField.addEventListener("input", () => {

    searchHelpers.textContent = "";
    
    // Function get
    //getSelectHelper(searchField.value, 6);

});


searchForm.addEventListener("submit", (e) => {

    // Blocage event form
    e.preventDefault();

    searchResults.textContent = "";
    nbResults.textContent = "";

    // Function get
    if (categoryField.value == "release") {
        getRelease(searchField.value);
    } else if (categoryField.value == "recording") {
        getTitle(searchField.value);
    } else if (categoryField.value == "artist") {
        getArtist(searchField.value);
    } 
});






