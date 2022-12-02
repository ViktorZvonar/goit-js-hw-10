import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';

import './css/styles.css';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

inputEl = document.querySelector('input');
countryListEl = document.querySelector('.country-list');
countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const value = inputEl.value.trim();
  if (value === '') {
    return (countryListEl.innerHTML = ''), (countryInfoEl.innerHTML = '');
  }

  fetchCountries(value)
    .then(data => {
      countryListEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
      if (data.length === 1) {
        countryListEl.insertAdjacentHTML('beforeend', renderList(data));
        countryInfoEl.insertAdjacentHTML('beforeend', renderInfo(data));
      } else if (data.length >= 10) {
        tooManyMatches();
      } else {
        countryListEl.insertAdjacentHTML('beforeend', renderList(data));
      }
    })
    .catch(onFetchError);
}

function renderList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `
          <li class="country__item">
              <img src="${flags.svg}" alt="${name.official}" width = 40px>
              <p class="country__name">${name.official}</p>
          </li>
          `;
    })
    .join('');
  return markup;
}

function renderInfo(data) {
  const markup = data
    .map(({ capital, population, languages }) => {
      return `
        <ul>
            <li class="info__item"><p><span>Capital: </span>${capital}</p></li>
            <li class="info__item"><p><span>Population: </span>${population}</p></li>
            <li class="info__item"></li><p><span>Languages: </span>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function tooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
