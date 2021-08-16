

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

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://musicbrainz.org/ws/2/recording/?query="${encodeURIComponent(something)}"&limit=100&fmt=json`, true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                // Masquage loader
                loading.classList.toggle("d-none");

                let response = JSON.parse(xhr.responseText);
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
    xhr.send();
}

// Artists
function getArtist(something) {

    console.log('Recherche artiste : ' + something);

    // Affichage loader
    loading.classList.toggle("d-none");

    const artistXhr = new XMLHttpRequest();
    artistXhr.open('GET', `http://musicbrainz.org/ws/2/artist/?query="${encodeURIComponent(something)}"&limit=100&fmt=json`, true);

    artistXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    artistXhr.addEventListener("readystatechange", () => {
        if (artistXhr.readyState === 4) {
            if (artistXhr.status === 200) {

                let response = JSON.parse(artistXhr.responseText);
                console.log(response);

                // Si Résultats
                if (response.artists) {

                    // Pour cahques artists, recherches ses chansons
                    response.artists.forEach((artist) => {
            
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', `http://musicbrainz.org/ws/2/recording?artist=${artist.id}&limit=100&fmt=json`, true);
        
                        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        
                        xhr.addEventListener("readystatechange", () => {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {

                                    // Masquage loader
                                    loading.classList.toggle("d-none");
        
                                    let response = JSON.parse(xhr.responseText);
                                    console.log(response);

                                    // Si Résultats
                                    if (response.recordings) {
                                        response.recordings.forEach((record, key) => {

                                            // Ligne de résultat
                                            // Ligne - li
                                            const liResult = document.createElement('li');
                                            liResult.id = record.id;                        // MBID
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
                                                colTitle.textContent = record.title;
                                                liResult.appendChild(colTitle);

                                                // Artist
                                                const colArtist = document.createElement('div');
                                                colArtist.classList = "col";
                                                colArtist.textContent = artist.name;
                                                liResult.appendChild(colArtist);

                                                // Album
                                                const colAlbum = document.createElement('div');
                                                colAlbum.classList = "col";
                                                //colAlbum.textContent = item["release-group"].title;
                                                liResult.appendChild(colAlbum);

                                                // Action
                                                const colAction = document.createElement('div');
                                                colAction.classList = "col";
                                                liResult.appendChild(colAction);
                                        });
                                    }
                                }
                            }
                        });

                        xhr.send();

                        /*
                        let artistXhr = new XMLHttpRequest();
                        artistXhr.open('GET', `http://musicbrainz.org/ws/2/release/${item.id}`, true);
                        artistXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        artistXhr.addEventListener("readystatechange", () => {
                        
                            let response = JSON.parse(artistXhr.responseText);
                            console.log("2:" + response);
                            

                        });
                        artistXhr.send();
                    */
                        //
                        

                    });
                }
            }
        }
    });

    artistXhr.send();

}

// Albums
function getRelease(something) {

    console.log('Recherche album : ' + something);

    // Affichage loader
    loading.classList.toggle("d-none");

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://musicbrainz.org/ws/2/release/?query=release:"${encodeURIComponent(something)}"&limit=100&fmt=json`, true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                // Masquage loader
                loading.classList.toggle("d-none");

                let response = JSON.parse(xhr.responseText);
                console.log(response);

                // Nombre de résultats
                const colNbResults = document.createElement('div');
                colNbResults.classList = "col d-flex justify-content-end"
                colNbResults.textContent = `${response.count} résultats`;
                nbResults.appendChild(colNbResults);
                
                // Si Résultats
                if (response.releases) {
                    response.releases.forEach((item, key) => {

                        
                        // Ligne de résultat
                        // Ligne - li
                        const liResult = document.createElement('li');
                        liResult.id = item["id"];                        // MBID
                        liResult.classList = "row py-3"
                        searchResults.appendChild(liResult);
                            
                            // id
                            const colId = document.createElement('div');
                            colId.classList = "col"
                            colId.textContent = key + 1;
                            liResult.appendChild(colId);
                            
                            // Title
                            const colTitle = document.createElement('div');
                            colTitle.classList = "col"
                            colTitle.textContent = item.title;
                            liResult.appendChild(colTitle);

                            // Artist
                            const colArtist = document.createElement('div');
                            colArtist.classList = "col"
                            colArtist.textContent = item["artist-credit"][0].name;
                            liResult.appendChild(colArtist);

                            // Album
                            const colAlbum = document.createElement('div');
                            colAlbum.classList = "col"
                            colAlbum.textContent = item["release-group"].title;
                            liResult.appendChild(colAlbum);

                            // Action
                            const colAction = document.createElement('div');
                            colAction.classList = "col"
                            liResult.appendChild(colAction);
                                    


                        /*
                        let artistXhr = new XMLHttpRequest();
                        artistXhr.open('GET', `http://musicbrainz.org/ws/2/release/${item.id}`, true);
                        artistXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        artistXhr.addEventListener("readystatechange", () => {
                        
                            let response = JSON.parse(artistXhr.responseText);
                            console.log("2:" + response);
                            

                        });
                        artistXhr.send();
                    */
                        //
                        

                    });
                }
            }
        }
    });

    xhr.send();

}


// Modal Update
function modalUpdate (mbid) {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://musicbrainz.org/ws/2/recording/${mbid}?inc=artist-credits+isrcs+releases+genres&rating&fmt=json`, true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.addEventListener("readystatechange", () => {
    
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                let response = JSON.parse(xhr.responseText);
                console.log(response);

                modalTitle;
                modalSongTitle.textContent = response["title"];
                modalSongArtist.textContent = response["artist-credit"][0].name;
                modalSongAlbum.textContent = response["releases"][0].title;
                modalSongGenres;

                let duration = response["length"]/1000;      // En Sec
                let sec = Math.round(duration%60) < 10 ? '0' + Math.round(duration%60) : Math.round(duration%60);
                let min = Math.round((duration-sec)/60);
                modalSongLength.textContent = `${min}:${sec}`;
                modalSongRate;
            }
        }

    });

    
    xhr.send();
}