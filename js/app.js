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
const modalSongRateCounter = document.querySelector('#song-rate-counter');
const modalSongRate = document.querySelector('#song-rate');
const coverArts = document.querySelector('#cover-arts');
const coverLoader = document.querySelector('#cover-loader');

// bonus
const welcomeText = document.querySelector('#welcome-text');


// Search Helper automatique
searchField.addEventListener("input", () => {

    // Init
    searchHelpers.textContent = "";

    // Pas de recherche sous les 3 caractères. Et puis quoi encore
    if (parseInt(searchField.value.length) >= 3) {
        getSelectHelper(searchField.value, 6);
    } 
    
});


searchForm.addEventListener("submit", (e) => {

    // Masquage du helper si non cliqué
    searchHelpers.textContent = "";

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
    } else if (categoryField.value == "everything") {
        getEverything(searchField.value)
    }
});


// Fonctionnalité Bonus 
const welcomeList = [
    'Une application que les licornes 🦄 nous envies',
    'jQuery aurait rêvé avoir sa place ici ✋',
    'George Washington aurait dit : "Voilà une application qui n\'est pas très crevette 🦐"',
    'Aucun animaux n\'a été maltraité 🐰 lors de la conception de cette web appli',
    'Une application que Neil Armstrong 👨‍🚀 a emmené avec lui sur la Lune 🌖',
    'Apple 🍎 en a rêvé, Nicolas l\'a faite !',
    'Cet App inclut une réécriture 🧑‍💻 totale de MusicBrainz',
    'Une application dont même le Covid 🦠 ne veut pas !',
    'Un ECF sans lequel le monde ce serait surement mieux porté ! 🙏',
    '🎵 "Adagio for Tron". Il y a des notes, des covers, des genres... tout pour être heureux !',
    'Si l\'on devait récompenser le temps passé à comprendre cette fu**** doc, je serais millionaire !' 
]

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

setInterval(() => {
    randomNumber = getRandom(0, welcomeList.length);
    welcomeText.textContent = welcomeList[randomNumber];
}, 6000);




