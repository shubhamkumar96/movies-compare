const createAutoComplete = ({ 
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData,
    resetColumn
}) => {
    root.innerHTML = `
        <div class="buttons" style="justify-content: center;">
            <button class="button is-danger reset">Reset Below Column</button>
        </div>
        <label><b>Search</b></label>
        <input class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    const resetButton = root.querySelector('.reset');

    const onInput = async (event) => {
        const items = await fetchData(event.target.value);
        // console.log(items);
        
        if(!items.length){
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');

        for(let item of items){
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        }

    };

    resetButton.addEventListener('click', resetColumn);

    input.addEventListener('input', debounce(onInput, 300));

    document.addEventListener('click', event => {
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        }
    });

};