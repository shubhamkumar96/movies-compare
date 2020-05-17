// For Creating Column
let columnCount = 0;
const createColumn = () => {

    let autocompleteName = "";
    let summaryName = "";
    if(columnCount === 0){
        autocompleteName = "first-autocomplete";
        summaryName = "first-summary";
    } else if (columnCount === 1) {
        autocompleteName = "second-autocomplete";
        summaryName = "second-summary";
    } else if (columnCount === 2) {
        autocompleteName = "third-autocomplete";
        summaryName = "third-summary";
    }

    const columnDiv = document.createElement('div');
    columnDiv.classList.add('column');
    columnDiv.innerHTML = `
        <div id="${autocompleteName}"></div>
        <div id="${summaryName}"></div>
    `;
    document.querySelector('.columns').appendChild(columnDiv);
    columnCount++;
    return document.querySelector(`#${autocompleteName}`);
};

//  ======================================================================================
// CONFIG Function
const autoCompleteConfig = {
   //   To query the poster and create 'drop-down' item.
   renderOption(movie) {
        const base_img_url = "https://image.tmdb.org/t/p/w500";
        const imgSrc = movie.poster_path === null ? '' : base_img_url + movie.poster_path;
        let releaseYear = ((movie.release_date + "").split('-'))[0];
        return `
            <img src="${imgSrc}" />
            ${movie.title} (${releaseYear})
        `;
    },  

    inputValue(movie) {
        return movie.title;
    },
    //  Call API to get list of Movies based on keywords.
    async fetchData(searchTerm) {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: 'f1aa11a7624dbaf3024fa5751d21ee70',
                query: searchTerm,
            }
        });
        // console.log(response);
        if(response.data.page === undefined){
            return [];
        }
        return response.data.results;
    },
};

//  ======================================================================================
//  For adding First Column
createAutoComplete({
    ...autoCompleteConfig,
    root: createColumn(),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#first-summary'), 'first');
    },
    resetColumn(){
        resetButton('first');
    }
});

//  For adding Second Column
createAutoComplete({
    ...autoCompleteConfig,
    root: createColumn(),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#second-summary'), 'second');
    },
    resetColumn(){
        resetButton('second');
    }
});

//  For adding Third Column
createAutoComplete({
    ...autoCompleteConfig,
    root: createColumn(),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#third-summary'), 'third');
    },
    resetColumn(){
        resetButton('third');
    }
});

//  ======================================================================================
//  For adding Reset Button.
const resetButton = (side) => {
    const summaryElement = document.querySelector(`#${side}-summary`);
    const inputElement = document.querySelector(`#${side}-autocomplete input`);
    summaryElement.innerHTML = '';
    inputElement.value = '';

    // console.log(summaryElement, inputElement);
    // columnCount = 0;
    summaryCount--;
    if(summaryCount > 1){
        runComparison();
    } else {
        returnStats();
    }

    if((document.querySelector('#first-summary').innerHTML === '') && 
        (document.querySelector('#second-summary').innerHTML === '') && 
        (document.querySelector('#third-summary').innerHTML === '')){
            document.querySelector('.tutorial').classList.remove('is-hidden');
            document.querySelector('footer').style.position = 'absolute';
    }
};

//  ======================================================================================
//  Calling APIs to get details for selected Movie.
let summaryCount = 0;
const onMovieSelect = async (movie, summaryElement, side) => {
    
    //Calling "TMDB" API
    const queryURL = "https://api.themoviedb.org/3/movie/" + movie.id + "?";
    const movieInformationTMDB = await axios.get(queryURL, {
        params: {
            api_key: 'f1aa11a7624dbaf3024fa5751d21ee70',
            language: 'en-US',
        }
    });
    // console.log(movieInformationTMDB);

    //Calling "OMDB" API, to get some data which are not present in "TMDB" API Results.
    const movieInformationOMDB = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '61b21cc',
            i: `${movieInformationTMDB.data.imdb_id}`,
        }
    });
    // console.log(movieInformationOMDB);
    summaryElement.innerHTML = movieTemplate(movieInformationOMDB.data, movieInformationTMDB.data);
    document.querySelector('footer').style.position = 'relative';
    summaryCount++;

    // console.log(`columnCount: ${columnCount}`, `summaryCount: ${summaryCount}`);
    if(summaryCount > 1){
        runComparison();
    } else {
        returnStats();
    }

}

//  ======================================================================================
// Below function return 'Stats' and also reset the colors of the 'article' element.
const returnStats = () => {
    const firstStats = document.querySelectorAll('#first-summary .notification');
    const secondStats = document.querySelectorAll('#second-summary .notification');
    const thirdStats = document.querySelectorAll('#third-summary .notification');

    let size;
    if(firstStats.length > 0){
        size = firstStats.length;
    } else if (secondStats.length > 0){
        size = secondStats.length;
    } else {
        size = thirdStats.length;
    }

    let firstColumnStat, secondColumnStat, thirdColumnStat;
    for(let index=0; index < size; index++){
        if(firstStats.length > 0){
            firstColumnStat = firstStats[index];
            firstColumnStat.classList.remove('is-primary');
            firstColumnStat.classList.add('is-info');
        }
        if(secondStats.length > 0){
            secondColumnStat = secondStats[index];
            secondColumnStat.classList.remove('is-primary');
            secondColumnStat.classList.add('is-info');
        }
        if(thirdStats.length > 0){
            thirdColumnStat = thirdStats[index];
            thirdColumnStat.classList.remove('is-primary');
            thirdColumnStat.classList.add('is-info');
        }
    }

    return {
        firstStats,
        secondStats,
        thirdStats,
        size
    };

};

//  ======================================================================================
const runComparison = () => {

    const {firstStats, secondStats, thirdStats, size} = returnStats();

    // console.log(firstStats.length, secondStats.length, thirdStats.length);
    for(let index=0; index < size; index++){
        // const valueArray = [];
        let firstColumnStat, secondColumnStat, thirdColumnStat;
        let firstColumnValue, secondColumnValue, thirdColumnValue ;

        if(firstStats.length > 0){
            firstColumnStat = firstStats[index];
            firstColumnValue = parseFloat(firstColumnStat.dataset.value);
            // valueArray.push(firstColumnValue);
        }
        if(secondStats.length > 0){
            secondColumnStat = secondStats[index];
            secondColumnValue = parseFloat(secondColumnStat.dataset.value);
            // valueArray.push(secondColumnValue);
        }
        if(thirdStats.length > 0){
            thirdColumnStat = thirdStats[index];
            thirdColumnValue = parseFloat(thirdColumnStat.dataset.value);
            // valueArray.push(thirdColumnValue);
        }
        // console.log(Array, valueArray);

        if(isNaN(firstColumnValue))
            firstColumnValue = 0;
        if(isNaN(secondColumnValue))
            secondColumnValue = 0;
        if(isNaN(thirdColumnValue))
            thirdColumnValue = 0;
        if(firstColumnValue > secondColumnValue && 
            ((thirdStats.length <= 0) || firstColumnValue > thirdColumnValue)) {
            firstColumnStat.classList.remove('is-info');
            firstColumnStat.classList.add('is-primary');
        } else if(secondColumnValue > firstColumnValue && 
            ((thirdStats.length <= 0) || secondColumnValue > thirdColumnValue)){
            secondColumnStat.classList.remove('is-info');
            secondColumnStat.classList.add('is-primary');
        } else if((thirdStats.length > 0) && 
            (thirdColumnValue > firstColumnValue && thirdColumnValue > secondColumnValue)){
            thirdColumnStat.classList.remove('is-info');
            thirdColumnStat.classList.add('is-primary');
        }
    }

};

//  ======================================================================================
const movieTemplate = (movieDetailOMDB, movieDetailTMDB) => {
    // console.log(movieDetailOMDB);
    // console.log(movieDetailTMDB);
    let dollars = "N/A";
    let metaScore = "N/A";
    let imdbRating = "N/A";
    let imdbVotes = "N/A";
    let awards = "N/A";
    // console.log(movieDetailTMDB.revenue);
    if(movieDetailTMDB.revenue !== undefined && movieDetailTMDB.revenue !== "N/A" && movieDetailTMDB.revenue !== 0){
        //  To format the number with commas as thousands separators (23456 to 23,456).
        let revenue = movieDetailTMDB.revenue;
        var parts = revenue.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        dollars = "$" + parts.join(".");
    }
        
    if(movieDetailOMDB.Metascore !== undefined && movieDetailOMDB.Metascore !== "N/A")
        metaScore = parseInt(movieDetailOMDB.Metascore);
    if(movieDetailOMDB.imdbRating !== undefined && movieDetailOMDB.imdbRating !== "N/A")
        imdbRating = parseFloat(movieDetailOMDB.imdbRating);   
    if(movieDetailOMDB.imdbVotes !== undefined && movieDetailOMDB.imdbVotes !== "N/A")
        imdbVotes = parseInt(movieDetailOMDB.imdbVotes.replace(/,/g, ''));
    if(movieDetailOMDB.Awards !== undefined && movieDetailOMDB.Awards !== "N/A"){
        awards = movieDetailOMDB.Awards.split(' ').reduce((prev, word) => {
            const value = parseInt(word);
            if(isNaN(value)){
                return prev;
            } else {
                return prev + value;
            }
        }, 0);
    }
    
    const base_img_url = "https://image.tmdb.org/t/p/w500";
    const imgSrc = movieDetailTMDB.poster_path === null ? '' : base_img_url + movieDetailTMDB.poster_path;

    // console.log(awards, dollars, metaScore, imdbRating, imdbVotes);
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${imgSrc}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetailTMDB.original_title}  (${movieDetailOMDB.Year})</h1>
                    <h4>${movieDetailOMDB.Genre}</h4>
                    <p>${movieDetailOMDB.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-info awardHeight">
            <p class="title">${movieDetailOMDB.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${movieDetailTMDB.revenue} class="notification is-info">
            <p class="title">${dollars}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article data-value=${metaScore} class="notification is-info">
            <p class="title">${metaScore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-info">
            <p class="title">${imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-info">
            <p class="title">${movieDetailOMDB.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};

//  ================================== THE END ====================================================