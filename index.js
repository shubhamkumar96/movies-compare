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

// CONFIG Function
const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '61b21cc',
                s: searchTerm,
            }
        });

        if(response.data.Error){
            return [];
        }
        
        return response.data.Search;
    },
};

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


const resetButton = (side) => {
    const summaryElement = document.querySelector(`#${side}-summary`);
    const inputElement = document.querySelector(`#${side}-autocomplete input`);
    summaryElement.innerHTML = '';
    inputElement.value = '';

    console.log(summaryElement, inputElement);

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

let firstMovie, secondMovie, thirdMovie;
let summaryCount = 0;
const onMovieSelect = async (movie, summaryElement, side) => {
    const movieInformation = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '61b21cc',
            i: `${movie.imdbID}`,
        }
    });
    // console.log(movieInformation.data);
    if(side === 'first') {
        firstMovie = movieInformation.data;
    } else if(side === 'second') {
        secondMovie = movieInformation.data;
    } else if (side === 'third') {
        thirdMovie = movieInformation.data;
    }

    summaryElement.innerHTML = movieTemplate(movieInformation.data);
    document.querySelector('footer').style.position = 'relative';
    summaryCount++;

    console.log(`columnCount: ${columnCount}`, `summaryCount: ${summaryCount}`);

    if(summaryCount > 1){
        runComparison();
    } else {
        returnStats();
    }

}

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

const movieTemplate = (movieDetail) => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        } else {
            return prev + value;
        }
    }, 0)

    // console.log(awards, dollars, metaScore, imdbRating, imdbVotes);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}  (${movieDetail.Year})</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-info awardHeight">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-info">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article data-value=${metaScore} class="notification is-info">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-info">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-info">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};