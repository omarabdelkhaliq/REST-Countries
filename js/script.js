const mainElement = document.querySelector("main");
const themeBtn = document.querySelector(".theme button");
const themeIcon = document.querySelector(".theme button i");

const mainSearchSection = document.querySelector(".main-search");
const searchInput = document.querySelector(".search-country input");
const searchRegionContainer = document.querySelector(".search-region");
const regionBtn = document.querySelector(".search-region button");
const regionBtnText = document.querySelector(".search-region button p");
const regionOptions = document.querySelectorAll(".regions li");

const countriesContainer = document.querySelector(".countries");

const detailView = document.getElementById("detailView");
const backBtn = document.getElementById("backBtn");
const themeText = document.querySelector(".theme button p");

let data = [];

async function getData() {
  try {
    const response = await fetch("data.json");
    data = await response.json();
    renderCountries(data);
  } catch (error) {
    console.log(error);
  }
};
getData();

function createCard(country) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<div class="flag">
          <img src="${country.flags.png}" alt="${country.name} flag" />
          </div>
          <div class="info">
            <div class="name">
              <h3>${country.name}</h3>
            </div>
            <div class="population-card">
              <p>Population: <span class="population">${country.population.toLocaleString()}</span></p>
            </div>
            <div class="region-card">
              <p>Region: <span class="region">${country.region}</span></p>
            </div>
            <div class="capital-card">
              <p>Capital: <span class="capital">${country.capital || "N/A"}</span></p>
            </div>
          </div>`;
  card.addEventListener("click", function () {
    showDetails(country);
  });
  countriesContainer.appendChild(card);
};

function showDetails(country) {
  detailView.style.display = "block";
  countriesContainer.style.display = "none";
  mainSearchSection.style.display = "none";
  const countryDetails = document.querySelector(".country-details");
  countryDetails.innerHTML = `
          <div class="detail-flag">
            <img src="${country.flags.png}" alt="${country.name} flag" />
          </div>
          <div class="detail-info">
            <h2>${country.name}</h2>
            <div class="info-columns">
              <ul class="info-left">
                <li>
                  <p>Native Name: <span class="native-name">${country.nativeName}</span></p>
                </li>
                <li>
                  <p>Population: <span class="detail-population">${country.population.toLocaleString()}</span></p>
                </li>
                <li>
                  <p>Region: <span class="detail-region">${country.region}</span></p>
                </li>
                <li>
                  <p>Sub Region: <span class="sub-region">${country.subregion}</span></p>
                </li>
                <li>
                  <p>Capital: <span class="detail-capital">${country.capital || "N/A"}</span></p>
                </li>
              </ul>
              <ul class="info-right">
                <li>
                  <p>Top Level Domain: <span class="tld">${country.topLevelDomain}</span></p>
                </li>
                <li>
                  <p>Currencies: <span class="currencies">${(country.currencies || []).map((c) => c.name).join(", ")}</span></p>
                </li>
                <li>
                  <p>Languages: <span class="languages">${country.languages.map((c) => c.name).join(", ")}</span></p>
                </li>
              </ul>
            </div>
            <div class="borders">
              <p>Border Countries:</p>
              <div class="border-buttons">${(country.borders || [])
                .map(
                  (code) =>
                    `<button data-code="${code}">${data.find((c) => c.alpha3Code === code).name}</button>`,
                )
                .join("")}</div>
            </div>
          </div>`;
  const borderBtns = countryDetails.querySelectorAll(".border-buttons button");
  borderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const code = btn.dataset.code;
      const borderCountry = data.find((c) => c.alpha3Code === code);
      showDetails(borderCountry);
    });
  });
};

backBtn.addEventListener("click", function () {
  detailView.style.display = "none";
  countriesContainer.style.display = "";
  mainSearchSection.style.display = "";
});

function renderCountries(list) {
  countriesContainer.innerHTML = "";
  list.forEach((country) => {
    createCard(country);
  });
};

searchInput.addEventListener("input", function () {
  searchText = searchInput.value.toLowerCase();
  applyFilters();
});

regionBtn.addEventListener("click", function () {
  searchRegionContainer.classList.toggle("active");
});

let searchText = "";
let selectedRegion = "";

function applyFilters() {
  const filtered = data.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchText);
    const matchesRegion =
      selectedRegion === "" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });
  renderCountries(filtered);
};

regionOptions.forEach((option) => {
  option.addEventListener("click", function () {
    selectedRegion = option.dataset.region;
    regionBtnText.textContent = option.textContent;
    searchRegionContainer.classList.toggle("active");
    applyFilters();
  });
});

function setTheme(isDark) {
  mainElement.classList.toggle("dark", isDark);
  themeIcon.classList.toggle("fa-moon", !isDark);
  themeIcon.classList.toggle("fa-sun", isDark);
  themeText.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

setTheme(localStorage.getItem("theme") === "dark");

themeBtn.addEventListener("click", function () {
  setTheme(!mainElement.classList.contains("dark"));
});
