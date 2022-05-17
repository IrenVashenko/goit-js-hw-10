import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


const ref = {
    inputData: document.querySelector("input#search-box"),
    listCountry: document.querySelector(".country-list"),
    infoCountry: document.querySelector(".country-info"),
}


ref.inputData.addEventListener("input", debounce(onSerchContry, DEBOUNCE_DELAY));

function onSerchContry(event) {
    event.preventDefault();
    ref.listCountry.innerHTML = "";
    ref.infoCountry.innerHTML = "";
    const form = event.target;
    const searchQuery = form.value.trim();
    if (searchQuery) {
        fetchCountries(searchQuery)
            .then(onCheckCount)
            .catch(error => console.log(error))
    }
}

function onCheckCount(country) {
    if (country.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
    else if (country.length >= 2 && country.length <= 10) {
        return renderCountriesList(country)
    }
    else {
        return renderCountriesCard(country)
    }
}

function renderCountriesList(country) {
    const makeup = country
        .map(({ flags, name }) => {
            return `<li class="country-item">
                    <img class="country-flag" src="${flags.svg}" width="30px">
                    <p class="name">${name.official}</p>
                 </li>`;
        }).join("");
    ref.listCountry.innerHTML = makeup
}

function renderCountriesCard(card) {
    const makeup = card
        .map(({ flags, name, capital, population, languages }) => {
            return `<div class="country-card card">
                <div class="name-flag">
                    <img class="country-flag" src="${flags.svg}" alt="" width="50px">
                    <p class="name card-name">${name.official}</p>
                </div>
                <p class="card-capital"><b>Capital:</b> ${capital}</p>
                <p class="card-population"><b>Population:</b> ${population}</p>
                <p class="card-languages"><b>Languages:</b> ${Object.values(languages)}</p>
            </div>`
        }).join("")
    ref.infoCountry.innerHTML = makeup;
}