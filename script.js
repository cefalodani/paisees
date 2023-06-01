const apiKey = '2a4db9f551d2e39a93a75d348ecab1a4';
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const clearButton = document.createElement('button');

searchInput.addEventListener('input', searchCountries);

function searchCountries() {
  const searchTerm = searchInput.value.trim();
  
  if (searchTerm === '') {qqqqqqqqqqqqqq
    clearSearch();
    return;
  }

  fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
      const filteredCountries = data.filter(country => {
        const countryName = country.name.common.toLowerCase();
        return countryName.includes(searchTerm.toLowerCase());
      });

      displayCountries(filteredCountries);
      showClearButton();
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayCountries(countries) {
  resultsContainer.innerHTML = '';

  if (countries.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron resultados</p>';
    return;
  }

  if (countries.length > 10) {
    resultsContainer.innerHTML = '<p>Por favor, sé más específico en tu búsqueda</p>';
    return;
  }

  countries.forEach(country => {
    const countryCard = createCountryCard(country);
    resultsContainer.appendChild(countryCard);

    // Obtener el clima del país
    getWeather(country.capital[0], countryCard);
  });
}

function createCountryCard(country) {
  const countryCard = document.createElement('div');
  countryCard.classList.add('country-card');

  const countryFlag = document.createElement('img');
  countryFlag.classList.add('country-flag');
  countryFlag.src = country.flags.svg;
  countryFlag.alt = `Bandera de ${country.name.common}`;
  countryCard.appendChild(countryFlag);

  const countryDetails = document.createElement('div');
  countryDetails.classList.add('country-details');

  const countryName = document.createElement('h2');
  countryName.textContent = country.name.common;
  countryDetails.appendChild(countryName);

  const countryInfo = document.createElement('p');
  countryInfo.innerHTML = `<strong>Capital:</strong> ${country.capital[0]}<br>
                           <strong>Región:</strong> ${country.region}<br>
                           <strong>Lenguaje:</strong> ${Object.values(country.languages).join(', ')}<br>
                           <strong>Moneda:</strong> ${country.currencies[Object.keys(country.currencies)[0]].name} (${country.currencies[Object.keys(country.currencies)[0]].symbol})`;
  countryDetails.appendChild(countryInfo);

  countryCard.appendChild(countryDetails);

  const weatherInfo = document.createElement('div');
  weatherInfo.classList.add('weather-info');
  countryCard.appendChild(weatherInfo);

  return countryCard;
}

function getWeather(city, weatherContainer) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;

      const weatherInfo = `<strong>Clima:</strong> ${weatherDescription}<br>
                           <strong>Temperatura:</strong> ${temperature}°C`;
      weatherContainer.querySelector('.weather-info').innerHTML = weatherInfo;
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function showClearButton() {
  if (!clearButton.parentNode) {
    clearButton.textContent = 'Borrar búsqueda';
    clearButton.addEventListener('click', clearSearch);
    resultsContainer.parentNode.appendChild(clearButton);
  }
}

function clearSearch() {
  searchInput.value = '';
  resultsContainer.innerHTML = '';
  clearButton.parentNode.removeChild(clearButton);
}