

function getSelectHelper(something, limit) {

    searchHelpers.textContent = "";
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://musicbrainz.org/ws/2/artist/?query=name:${encodeURIComponent(something)}&limit=${limit}&fmt=json`, true);

    // xhr.setRequestHeader('User-Agent', 'My-music-app/1.0 ( nmarcau@gmail.com )');

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                searchHelpers.textContent = "";

                let response = JSON.parse(xhr.responseText);
                console.log(response);

                response.annotations.forEach(item => {
                    const liItem = document.createElement('li');
                    liItem.classList = "search-helpers p-3";
                    liItem.textContent = item.name;
                    searchHelpers.appendChild(liItem);
                });
            }
        }
    });

    xhr.send();
}

// Fonction d'affichage d'une ligne de résultats
function showLineResult(count, title, artist , release, mbid) {

    // Ligne de résultat
    // Ligne - li
    const liResult = document.createElement('li');
    liResult.classList = "row py-3";
    searchResults.appendChild(liResult);
        
    // id
    const colId = document.createElement('div');
    colId.classList = "col";
    colId.textContent = count + 1;
    liResult.appendChild(colId);

    // Title
    const colTitle = document.createElement('div');
    colTitle.classList = "col";
    colTitle.textContent = title;
    liResult.appendChild(colTitle);

    // Artist
    const colArtist = document.createElement('div');
    colArtist.classList = "col";
    colArtist.textContent = artist;
    liResult.appendChild(colArtist);

    // Album
    const colAlbum = document.createElement('div');
    colAlbum.classList = "col";
    colAlbum.textContent = release;
    liResult.appendChild(colAlbum);

    // Action
    const colAction = document.createElement('div');
    colAction.classList = "col text-center";
    liResult.appendChild(colAction);

    // Bouton +
    const infoButton = document.createElement('button');
    infoButton.id = mbid;                                                 // MBID
    infoButton.classList = "btn px-4 py-3 bg-blue-2 info-btn fw-bold";
    infoButton.textContent = "+";
    colAction.appendChild(infoButton);

    // Plus d'infos
    infoButton.addEventListener('click', () => {

        // Update infos modal
        modalUpdate(infoButton.id);

        //
        infoModal.show();
    });
}

function showMore(offset) {

    // Ligne - li
    const liResult = document.createElement('li');
    liResult.classList = "row py-3";
    searchResults.appendChild(liResult);
        
    // id
    const colId = document.createElement('div');
    colId.classList = "col";
    colId.textContent = `En voir plus. ${offset}`;
    liResult.appendChild(colId);

}

// Title
function getTitle(something, offset) {

    console.log('Recherche titre : ' + something);

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query="${encodeURIComponent(something)}"&limit=100&fmt=json`, true);

    searchXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    searchXhr.addEventListener("readystatechange", () => {
        if (searchXhr.readyState === 4) {
            if (searchXhr.status === 200) {

                // Masquage loader
                loading.classList.toggle("d-none");

                let response = JSON.parse(searchXhr.responseText);
                console.log(response);

                // Nombre de résultats
                const colNbResults = document.createElement('div');
                colNbResults.classList = "col d-flex justify-content-end"
                colNbResults.textContent = `${response['count']} résultats`;
                nbResults.appendChild(colNbResults);

                // Si Résultats
                if (response.recordings) {

                    // Compteur pour offset
                    let count = 0;

                    response.recordings.forEach((result, key) => {

                        // RÉSULTATS
                        showLineResult(key, result['title'], result['artist-credit'][0]['name'], result['releases'] ? result['releases'][0]['title'] : '', result['id']);

                        // Compteur pour offset
                        count = key + 1;
                      
                    });
                }
            }
        }
    });
    searchXhr.send();
}

// Albums
function getRelease(something, offset) {

    console.log('Recherche album : ' + something);

    let count = 1;

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query=release:"${encodeURIComponent(something)}"&limit=100&fmt=json`, true);

    searchXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    searchXhr.addEventListener("readystatechange", () => {

        if (searchXhr.readyState === 4) {
            if (searchXhr.status === 200) {

                let releasesResponse = JSON.parse(searchXhr.responseText);
                console.log(releasesResponse);

                // Masquage loader
                loading.classList.toggle("d-none");

                // Nombre de résultats
                const colNbResults = document.createElement('div');
                colNbResults.classList = "col d-flex justify-content-end"
                colNbResults.textContent = `${releasesResponse['count']} résultats`;
                nbResults.appendChild(colNbResults);

                // If Releases
                if (releasesResponse.recordings) {

                    // Compteur pour offset
                    let count = 0;
                   
                    // Pour chaques album, recherches des chansons ---------------------------------------------------------------------------------
                    releasesResponse.recordings.forEach((result, key) => {
                    
                        // RÉSULTATS
                        showLineResult(key, result['title'], result['artist-credit'][0]['name'], result['releases'] ? result['releases'][0]['title'] : '', result['id']);

                        // Compteur pour offset
                        count = key + 1;
                       
                    }); // End - forEach Release
                } // End - If Releases
            } // End - searchXhr - Status 200
        } // End - searchXhr - readyState 4
    }); // End - searchXhr - eventListener - readyStateChange

    searchXhr.send();

}



// Artists
function getArtist(something, offset) {

    console.log('Recherche artiste : ' + something);

    let count = 1;

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query=artist:"${encodeURIComponent(something)}"?inc=releases&limit=100&fmt=json`, true);

    searchXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    searchXhr.addEventListener("readystatechange", () => {
        if (searchXhr.readyState === 4) {
            if (searchXhr.status === 200) {

                let artistResponse = JSON.parse(searchXhr.responseText);
                console.log(artistResponse);

                // Masquage loader
                loading.classList.toggle("d-none");

                // Nombre de résultats
                const colNbResults = document.createElement('div');
                colNbResults.classList = "col d-flex justify-content-end"
                colNbResults.textContent = `${artistResponse['count']} résultats`;
                nbResults.appendChild(colNbResults);

                // If Artist
                if (artistResponse.recordings) {

                    // Compteur pour offset
                    let count = 0;

                    // Pour chaques artists, recherches des albums ---------------------------------------------------------------------------------
                    artistResponse.recordings.forEach((result, key) => {
                    
                        // RÉSULTATS
                        showLineResult(key, result['title'], result['artist-credit'][0]['name'], result['releases'] ? result['releases'][0]['title'] : '', result['id']);
                        
                        // Compteur pour offset
                        count = key + 1;

                    }); // End - forEach Artist

                    showMore(count);

                } // End - If Artist
            } // End - searchXhr - Status 200
        } // End - searchXhr - readyState 4
    }); // End - searchXhr - eventListener - readyStateChange

    searchXhr.send();
}




// Modal Update
function modalUpdate (mbid) {

    // Init
    modalTitle.textContent = "";
    modalSongTitle.textContent = "";
    modalSongArtist.textContent = "";
    modalSongAlbum.textContent = "";
    modalSongGenres.textContent = "";
    modalSongLength.textContent = "";
    modalSongRate.textContent = "";
    coverArts.textContent = "";


    const recordingXhr = new XMLHttpRequest();
    recordingXhr.open('GET', `http://musicbrainz.org/ws/2/recording/${mbid}?inc=artist-credits+releases+genres+ratings&fmt=json`, true);

    recordingXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    recordingXhr.addEventListener("readystatechange", () => {
    
        if (recordingXhr.readyState === 4) {
            if (recordingXhr.status === 200) {

                let recordingResponse = JSON.parse(recordingXhr.responseText);
                console.log(recordingResponse);


                // Modal informations
                // Titre modal
                modalTitle.textContent = `${recordingResponse["artist-credit"][0].name} - ${recordingResponse["title"]}`;

                // Song title
                modalSongTitle.textContent = recordingResponse["title"];

                // Artiste(s)
                for (let i = 0; i < recordingResponse["artist-credit"].length; i++) {
                    modalSongArtist.textContent += `${recordingResponse["artist-credit"][i].name}, `;
                }

                // Album(s)
                for (let i = 0; i <  recordingResponse["releases"].length; i++) {
                    modalSongAlbum.textContent += `${recordingResponse["releases"][i].title}, `;

                    // Cover arts
                    const releaseXhr = new XMLHttpRequest();
                    releaseXhr.open('GET', `http://coverartarchive.org/release/${recordingResponse["releases"][i].id}`, true);

                    releaseXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    releaseXhr.setRequestHeader("Accept", "application/json");

                    releaseXhr.addEventListener("readystatechange", () => {
                        if (releaseXhr.readyState === 4) {
                            if (releaseXhr.status === 200) {

                                let releaseResponse = JSON.parse(releaseXhr.responseText);
                                // console.log(releaseResponse);

                                // Covers
                                releaseResponse.images.forEach(img => {
                                    const coverImg = document.createElement('img');
                                    coverImg.classList = "col-6";
                                    coverImg.setAttribute('src', img.image);
                                    coverArts.appendChild(coverImg);
                                });

                            } else if (releaseXhr.status === 404) {

                                // No cover message
                                const coverMsg = document.createElement('small');
                                coverMsg.classList = "col-12 text-muted";
                                coverMsg.textContent = "Aucunes images trouvées !";
                                coverArts.appendChild(coverMsg);

                            } // End - releaseXhr - Status
                        } // End - releaseXhr - readyState 4
                    }); // End - releaseXhr - eventListener - readyStateChange

                    releaseXhr.send();
                    

                }
                 
                // Genres ?!
                // Il y a t'il des genres ?
                if (recordingResponse["genres"].length > 0) {
                    for (let i = 0; i < recordingResponse["genres"].length; i++) {
                        modalSongGenres.textContent += `${recordingResponse["genres"][i].name}, `;
                    }
                } else {
                    modalSongGenres.textContent += 'Aucun genres !';
                }
                

                // Duration
                let duration = recordingResponse["length"]/1000;      // En Sec
                let sec = Math.round(duration%60) < 10 ? '0' + Math.round(duration%60) : Math.round(duration%60);
                let min = Math.round((duration-sec)/60);
                modalSongLength.textContent = `${min}:${sec}`;

                // Rating
                switch (recordingResponse.rating.value) {
                    case 5:
                        modalSongRate.textContent = "5/5 ⭐️ ⭐️ ⭐️ ⭐️ ⭐️";
                        break;
                    case 4:
                        modalSongRate.textContent = "4/5 ⭐️ ⭐️ ⭐️ ⭐️";
                        break;
                    case 3:
                        modalSongRate.textContent = "3/5 ⭐️ ⭐️ ⭐️";
                        break;
                    case 2:
                        modalSongRate.textContent = "2/5 ⭐️ ⭐️";
                        break;
                    case 1:
                        modalSongRate.textContent = "1/5 ⭐️";
                        break;
                    case 1:
                        modalSongRate.textContent = "0/5";
                        break;
                    default:
                        modalSongRate.textContent = "Il n'y a pas d'évaluation";
                        break;
                }

               

            }
        }
    });

    recordingXhr.send();
}