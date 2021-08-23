

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



// Title
function getTitle(something) {

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
                colNbResults.textContent = `${response.count} résultats`;
                nbResults.appendChild(colNbResults);

                // Si Résultats
                if (response.recordings) {
                    response.recordings.forEach((item, key) => {

                        // Ligne de résultat
                        // Ligne - li
                        const liResult = document.createElement('li');
                        liResult.classList = "row py-3";
                        searchResults.appendChild(liResult);
                            
                        // id
                        const colId = document.createElement('div');
                        colId.classList = "col";
                        colId.textContent = key + 1;
                        liResult.appendChild(colId);
                        
                        // Title
                        const colTitle = document.createElement('div');
                        colTitle.classList = "col";
                        colTitle.textContent = item.title;
                        liResult.appendChild(colTitle);

                        // Artist
                        const colArtist = document.createElement('div');
                        colArtist.classList = "col";
                        colArtist.textContent = item["artist-credit"][0].name;
                        liResult.appendChild(colArtist);

                        // Album
                        const colAlbum = document.createElement('div');
                        colAlbum.classList = "col";
                        if (item["releases"]) {
                            colAlbum.textContent = item["releases"][0].title;
                        } else {
                            colAlbum.textContent = "";
                        }
                        liResult.appendChild(colAlbum);

                        // Action
                        const colAction = document.createElement('div');
                        colAction.classList = "col text-center";
                        liResult.appendChild(colAction);

                        // Bouton +
                        const infoButton = document.createElement('button');
                        infoButton.id = item["id"];                                                 // MBID
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

                    });
                }
            }
        }
    });
    searchXhr.send();
}

// Albums
function getRelease(something) {

    console.log('Recherche album : ' + something);

    let count = 1;

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/release/?query=release:"${encodeURIComponent(something)}"&limit=100&fmt=json`, true);

    searchXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    searchXhr.addEventListener("readystatechange", () => {

        if (searchXhr.readyState === 4) {
            if (searchXhr.status === 200) {

                let artistResponse = JSON.parse(searchXhr.responseText);
                console.log(artistResponse);

                // Nombre de résultats
                const colNbResults = document.createElement('div');
                colNbResults.classList = "col d-flex justify-content-end"
                colNbResults.textContent = `${artistResponse.count} résultats`;
                nbResults.appendChild(colNbResults);
                
                // If Releases
                if (artistResponse.releases) {
                   
                    // Pour chaques album, recherches des chansons ---------------------------------------------------------------------------------
                    artistResponse.releases.forEach((release) => {

                        // Log
                        console.log('Recherche des chansons pour : ' + release["artist-credit"][0].name + ' | ' + release.title);

                        const releaseXhr = new XMLHttpRequest();
                        releaseXhr.open('GET', `http://musicbrainz.org/ws/2/release/${release.id}?inc=recordings&limit=100&fmt=json`, true);
        
                        releaseXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        
                        releaseXhr.addEventListener("readystatechange", () => {
                            if (releaseXhr.readyState === 4) {
                                if (releaseXhr.status === 200) {

                                    // Masquage loader
                                    loading.classList.toggle("d-none");
        
                                    let recordingResponse = JSON.parse(releaseXhr.responseText);
                                    // console.log(recordingResponse);

                                    // If Recording
                                    if (recordingResponse.media[0].tracks) {

                                        // Pour chaques chansons, affiche les infos ---------------------------------------------------------------------------------
                                        recordingResponse.media[0].tracks.forEach((record) => {

                                            // Log
                                            // console.log(record.recording.title + ' | ' + release.title + ' | ' + artist.name);
                                        
                                            // Ligne de résultat
                                            // Ligne - li
                                            const liResult = document.createElement('li');
                                            liResult.classList = "row py-3";
                                            searchResults.appendChild(liResult);
                                                
                                            // id
                                            const colId = document.createElement('div');
                                            colId.classList = "col";
                                            colId.textContent = count;
                                            liResult.appendChild(colId);

                                            // Compteur
                                            count += 1;
                                            
                                            // Title
                                            const colTitle = document.createElement('div');
                                            colTitle.classList = "col";
                                            colTitle.textContent = record.recording.title;
                                            liResult.appendChild(colTitle);

                                            // Artist
                                            const colArtist = document.createElement('div');
                                            colArtist.classList = "col";
                                            colArtist.textContent = release["artist-credit"][0].name;
                                            liResult.appendChild(colArtist);

                                            // Album
                                            const colAlbum = document.createElement('div');
                                            colAlbum.classList = "col";
                                            colAlbum.textContent = release.title;
                                            liResult.appendChild(colAlbum);

                                            // Action
                                            const colAction = document.createElement('div');
                                            colAction.classList = "col text-center";
                                            liResult.appendChild(colAction);

                                            // Bouton +
                                            const infoButton = document.createElement('button');
                                            infoButton.id = record.recording.id;                                                 // MBID
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

                                        }); // End - forEach Recording
                                    } // End - If Recording
                                } // End - releaseXhr - Status 200
                            } // End - releaseXhr - readyState 4
                        }); // End - releaseXhr - eventListener - readyStateChange

                        releaseXhr.send();

                    }); // End - forEach Release
                
                } // End - If Releases
            } // End - searchXhr - Status 200
        } // End - searchXhr - readyState 4
    }); // End - searchXhr - eventListener - readyStateChange

    searchXhr.send();

}


// Artists
function getArtist(something) {

    console.log('Recherche artiste : ' + something);

    let count = 1;
    let totalResult = 0;

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/artist/?query="${encodeURIComponent(something)}"&limit=100&fmt=json`, true);

    searchXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    searchXhr.addEventListener("readystatechange", () => {
        if (searchXhr.readyState === 4) {
            if (searchXhr.status === 200) {

                let artistResponse = JSON.parse(searchXhr.responseText);
                //console.log(artistResponse);

                // If Artist
                if (artistResponse.artists) {

                    // Pour chaques artists, recherches des albums ---------------------------------------------------------------------------------
                    artistResponse.artists.forEach((artist) => {

                        // Log
                        console.log('Recherche des albums pour : ' + artist.name);
            
                        const artistXhr = new XMLHttpRequest();
                        
                        // recording/?query=artist:"ton artiste"
                        artistXhr.open('GET', `http://musicbrainz.org/ws/2/artist/${artist.id}?inc=releases&limit=100&fmt=json`, true);
        
                        artistXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        artistXhr.setRequestHeader('User-Agent', 'MyMusicApp/1.0 ( nmarcau@gmail.com )');
                        
                        artistXhr.addEventListener("readystatechange", () => {
                            if (artistXhr.readyState === 4) {
                                if (artistXhr.status === 200) {

                                    let releaseResponse = JSON.parse(artistXhr.responseText);
                                    // console.log(releaseResponse);

                                    // If Release
                                    if (releaseResponse.releases) {

                                        // Pour chaques album, recherches des chansons ---------------------------------------------------------------------------------
                                        releaseResponse.releases.forEach((release) => {

                                            // Log
                                            console.log('Recherche des chansons pour : ' + artist.name + ' | ' + release.title);

                                            const releaseXhr = new XMLHttpRequest();
                                            releaseXhr.open('GET', `http://musicbrainz.org/ws/2/release/${release.id}?inc=recordings&limit=100&fmt=json`, true);
                            
                                            releaseXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                                            releaseXhr.setRequestHeader('User-Agent', 'MyMusicApp/1.0 ( nmarcau@gmail.com )');
                                            
                                            releaseXhr.addEventListener("readystatechange", () => {
                                                if (releaseXhr.readyState === 4) {
                                                    if (releaseXhr.status === 200) {
                    
                                                        // Masquage loader
                                                        loading.classList.toggle("d-none");
                            
                                                        let recordingResponse = JSON.parse(releaseXhr.responseText);
                                                        // console.log(recordingResponse);

                                                        // If Recording
                                                        if (recordingResponse.media[0].tracks) {

                                                            // Pour chaques chansons, affiche les infos ---------------------------------------------------------------------------------
                                                            recordingResponse.media[0].tracks.forEach((record, key) => {

                                                                totalResult += key;
                                                                colNbResults.textContent = `${totalResult} résultats`;


                                                                // Log
                                                                // console.log(record.recording.title + ' | ' + release.title + ' | ' + artist.name);
                                                            
                                                                // Ligne de résultat
                                                                // Ligne - li
                                                                const liResult = document.createElement('li');
                                                                liResult.classList = "row py-3";
                                                                searchResults.appendChild(liResult);
                                                                    
                                                                // id
                                                                const colId = document.createElement('div');
                                                                colId.classList = "col";
                                                                colId.textContent = count;
                                                                liResult.appendChild(colId);

                                                                // Compteur
                                                                count += 1;
                                                                
                                                                // Title
                                                                const colTitle = document.createElement('div');
                                                                colTitle.classList = "col";
                                                                colTitle.textContent = record.recording.title;
                                                                liResult.appendChild(colTitle);

                                                                // Artist
                                                                const colArtist = document.createElement('div');
                                                                colArtist.classList = "col";
                                                                colArtist.textContent = artist.name;
                                                                liResult.appendChild(colArtist);

                                                                // Album
                                                                const colAlbum = document.createElement('div');
                                                                colAlbum.classList = "col";
                                                                colAlbum.textContent = release.title;
                                                                liResult.appendChild(colAlbum);

                                                                // Action
                                                                const colAction = document.createElement('div');
                                                                colAction.classList = "col text-center";
                                                                liResult.appendChild(colAction);

                                                                // Bouton +
                                                                const infoButton = document.createElement('button');
                                                                infoButton.id = record.recording.id;                                                 // MBID
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

                                                            }); // End - forEach Recording
                                                        } // End - If Recording
                                                    } // End - releaseXhr - Status 200
                                                } // End - releaseXhr - readyState 4
                                            }); // End - releaseXhr - eventListener - readyStateChange

                                            releaseXhr.send();

                                            

                                        }); // End - forEach Release
                                    } // End - If Release
                                } // End - artistXhr - Status 200
                            } // End - artistXhr - readyState 4
                        }); // End - artistXhr - eventListener - readyStateChange

                        artistXhr.send();

                    }); // End - forEach Artist
                } // End - If Artist
            } // End - searchXhr - Status 200
        } // End - searchXhr - readyState 4
    }); // End - searchXhr - eventListener - readyStateChange

    searchXhr.send();

    // Nombre de résultats
    const colNbResults = document.createElement('div');
    colNbResults.classList = "col d-flex justify-content-end"
    nbResults.appendChild(colNbResults);

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