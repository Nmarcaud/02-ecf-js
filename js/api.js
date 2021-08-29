

function getSelectHelper(something, limit) {

    console.log('coucou')

    searchHelpers.textContent = "";
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query="${encodeURIComponent(something)}"&limit=${limit}&fmt=json`, true);

    // xhr.setRequestHeader('User-Agent', 'My-music-app/1.0 ( nmarcau@gmail.com )');submit-btn

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                searchHelpers.textContent = "";

                let response = JSON.parse(xhr.responseText);
                console.log(response.recordings);

                response.recordings.forEach(item => {
                    const liItem = document.createElement('li');
                    liItem.classList = "search-helpers p-3";
                    liItem.textContent = item['title'];
                    searchHelpers.appendChild(liItem);


                    // Action show more results
                    liItem.addEventListener('click', () => {

                        searchHelpers.textContent = "";
                        searchField.value = liItem.textContent;
                        // pour garder le focus sur le champ (sinon on ne peut plus valider avec enter !)
                        searchField.focus();

                    });


                });

                
            }
        }
    });

    xhr.send();
}

// Fonction d'affichage d'une ligne de résultats
function showLineResult(count, title, artist , release, mbid)
{

    // Ligne de résultat
    // Ligne - li
    const liResult = document.createElement('li');
    liResult.classList = "row py-3 li-result d-flex align-items-center";
    searchResults.appendChild(liResult);
        
    // id
    const colId = document.createElement('div');
    colId.classList = "col-1";
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
    colAction.classList = "col-1 text-end";
    liResult.appendChild(colAction);

    // Bouton +
    const infoButton = document.createElement('button');
    infoButton.id = mbid;                                                 // MBID
    infoButton.classList = "btn btn-blue px-4 py-3 info-btn fw-bold";
    infoButton.textContent = "+";
    colAction.appendChild(infoButton);

    // Plus d'infos (modal)
    infoButton.addEventListener('click', () => {

        // Update infos modal
        modalUpdate(infoButton.id);
        infoModal.show();
    });
}

function showMore(offset, requete)
{

    console.log(requete);

    // Ligne - li
    const liShowMore = document.createElement('li');
    liShowMore.classList = "row py-3 ";
    searchResults.appendChild(liShowMore);
        
    // id
    const colShowMore = document.createElement('div');
    colShowMore.classList = "col";
    liShowMore.appendChild(colShowMore);

    const buttonShowMore = document.createElement('button');
    buttonShowMore.value = offset;
    buttonShowMore.setAttribute('data-requete', requete);
    buttonShowMore.classList = "btn btn-blue btn-more mb-5";
    buttonShowMore.textContent = 'En voir plus !';
    colShowMore.appendChild(buttonShowMore);

    // Action show more results
    buttonShowMore.addEventListener('click', () => {
        liShowMore.remove();

        console.log(requete);

        // Function get
        if (requete == "release") {
            getRelease(searchField.value, buttonShowMore.value);
        } else if (requete == "recording") {
            getTitle(searchField.value, buttonShowMore.value);
        } else if (requete == "artist") {
            getArtist(searchField.value, buttonShowMore.value);
        } else if (categoryField.value == "everything") {
            getEverything(searchField.value, buttonShowMore.value)
        }
    });

}

// Title
function getTitle(something, offset) {

    console.log('Recherche titre : ' + something);
    
    // Si offset n'est pas défini, count à 0, sinon offset
    offset == undefined ? count = 0 : count = parseInt(offset);

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query=recording:"${encodeURIComponent(something)}"&limit=100&offset=${offset}&fmt=json`, true);

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
                    response.recordings.forEach((result) => {

                        // RÉSULTATS
                        showLineResult(count, result['title'], result['artist-credit'][0]['name'], result['releases'] ? result['releases'][0]['title'] : '', result['id']);

                        // Compteur pour offset
                        count += 1;
                      
                    });
                // En voir plus
                count < response['count'] ? showMore(count , "recording"):'';
                }
            }
        }
    });
    searchXhr.send();
}

// Albums
function getRelease(something, offset) {

    console.log('Recherche album : ' + something);
    
    // Si offset n'est pas défini, count à 0, sinon offset
    offset == undefined ? count = 0 : count = parseInt(offset);

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query=release:"${encodeURIComponent(something)}"&limit=100&offset=${offset}&fmt=json`, true);

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
                    releasesResponse.recordings.forEach((result) => {
                    
                        // RÉSULTATS
                        showLineResult(count, result['title'], result['artist-credit'][0]['name'], result['releases'] ? result['releases'][0]['title'] : '', result['id']);

                        // Compteur pour offset
                        count += 1;
                       
                    });
                
                // En voir plus
                count < releasesResponse['count'] ? showMore(count , "release"):'';

                }
            }
        }
    });

    searchXhr.send();

}


// Artists
function getArtist(something, offset) {

    console.log('Recherche artiste : ' + something);

    // Si offset n'est pas défini, count à 0, sinon offset
    offset == undefined ? count = 0 : count = parseInt(offset);

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query=artist:"${encodeURIComponent(something)}"?inc=releases&limit=100&offset=${offset}&fmt=json`, true);

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

                    artistResponse.recordings.forEach((result) => {
                    
                        // RÉSULTATS
                        showLineResult(count, result['title'], result['artist-credit'][0]['name'], result['releases'] ? result['releases'][0]['title'] : '', result['id']);
                        
                        // Compteur pour offset
                        count += 1;

                    });

                // En voir Plus
                count < artistResponse['count'] ? showMore(count , "artist"):'';

                }
            }
        }
    });
    searchXhr.send();
}

// Everything
function getEverything(something, offset) {

    console.log('Recherche partout : ' + something);

    // Si offset n'est pas défini, count à 0, sinon offset
    offset == undefined ? count = 0 : count = parseInt(offset);

    // Affichage loader
    loading.classList.toggle("d-none");

    const searchXhr = new XMLHttpRequest();
    searchXhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query="${encodeURIComponent(something)}"?inc=releases&limit=100&offset=${offset}&fmt=json`, true);

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

                    artistResponse.recordings.forEach((result) => {
                    
                        // RÉSULTATS
                        showLineResult(count, result['title'], result['artist-credit'][0]['name'], result['releases'] ? result['releases'][0]['title'] : '', result['id']);
                        
                        // Compteur pour offset
                        count += 1;

                    });

                // En voir Plus
                count < artistResponse['count'] ? showMore(count , "everything"):'';

                }
            }
        }
    });
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

    // Loader
    coverLoader.classList.toggle("d-none");


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
                                console.log(releaseResponse);

                                // Covers
                                releaseResponse.images.forEach(img => {
                                    const coverImg = document.createElement('img');
                                    coverImg.classList = "col-6";
                                    coverImg.setAttribute('src', img['thumbnails']['small']);
                                    coverArts.appendChild(coverImg);
                                });
                            }
                        }
                    });
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
                modalSongRateCounter.textContent = recordingResponse['rating']['votes-count'] + ' vote(s)';

                if(recordingResponse.rating.value > 4.5 ){
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 4.5 && recordingResponse.rating.value > 4 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star-half sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 4 && recordingResponse.rating.value > 3.5 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 3.5 && recordingResponse.rating.value > 3 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star-half sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 3 && recordingResponse.rating.value > 2.5 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 2.5 && recordingResponse.rating.value > 2 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i><i class="fas fa-star-half sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 2 && recordingResponse.rating.value > 1.5 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 1.5 && recordingResponse.rating.value > 1 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i><i class="fas fa-star-half sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 1 && recordingResponse.rating.value > 0.5 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star sunflo-3"></i>`;
                } else if (recordingResponse.rating.value <= 0.5 && recordingResponse.rating.value > 0 ) {
                    modalSongRate.innerHTML = `<small class="me-2">${recordingResponse.rating.value}/5</small><i class="fas fa-star-half sunflo-3"></i>`;
                } else {
                    modalSongRate.textContent = "Il n'y a pas d'évaluation";
                }
            }
        }
    });

    recordingXhr.send();
}

