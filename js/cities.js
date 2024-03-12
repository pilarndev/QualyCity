import { showSalaries, showCostOfLiving, addSortListener } from "../modules/cities/sortTables.js";
import { handleFavorite } from "../modules/cities/favoriteCity.js";
import { getDataCityByCodeAPI, getDescCityAPI } from "../modules/model/api.js";
import { appendFooter, appendHeader } from "../modules/templates.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

/*********************************CABECERA Y PIE**************************************************/

appendFooter();
appendHeader();

/*********************************PRINCIPAL*******************************************************/
/**
 * Obtiene de la API de Teleport los datos de la ciudad y los muestra
 */
async function getDataCity() {
  // Obtenemos los parámetros enviados por query
  const url = new URL(window.location.href);
  const cityCode = url.searchParams.get("q");

  // Obtenemos los datos de la API de Teleport
  const city = await getDataCityByCodeAPI(cityCode);

  // Obtenemos de la API de wikipedia la informacion y la mostramos
  getShowDescCity(city);

  // Datos básicos de la ciudad
  showDataCity(city);

  // Scores
  showScoresCity(city);

  // Salaries
  const salaries = city.salaries;
  showSalaries(salaries, "salary", true);
  addSortListener("salaries", "salary", true, showSalaries, salaries);
  addSortListener("salaries", "job", true, showSalaries, salaries);

  // Cost of living
  const costOfLiving = city.costOfLiving;
  showCostOfLiving(city.costOfLiving, "item", true);
  addSortListener("cost-of-living", "item", true, showCostOfLiving, costOfLiving);
  addSortListener("cost-of-living", "price", true, showCostOfLiving, costOfLiving);

  // Map
  showMap(city.location);

  // Favoritos
  handleFavorite(city, cityCode);
}
getDataCity();

/*********************************DESCRIPCIÓN*****************************************************/
/**
 * Recupera de la API de Wikivoyage la descripción de la ciudad y la muestra
 */
async function getShowDescCity(city) {

  // Obtenemos de la API los datos y los mostramos
  const data = await getDescCityAPI(city.name, city.division);
  const infoElement = document.querySelector("#city-info-text");
  const btnElement = document.querySelector("#btn-see-more");
  infoElement.innerHTML = data;

  // Si la información no cabe en el contenedor padre, mostramos el botón "see more"
  if (infoElement.scrollHeight > infoElement.parentElement.clientHeight) {
    btnElement.classList.remove("d-none");
  }

  // Asociamos el evento para desplegar o encoger la informacion (toggleText)
  btnElement.addEventListener("click", () => {
    const textElement = document.querySelector(".city-info");
    textElement.classList.toggle("expanded");
    if (!textElement.classList.contains("expanded")) {
      btnElement.textContent = "see more";
      window.scrollTo(0, 400);  // Volvemos arriba
    } else {
      btnElement.textContent = "see less";
    }
  });
}

/*********************************IMAGEN & NOMBRE*************************************************/

/**
 * Muestra la imagen y nombre de la ciudad
 */
function showDataCity(city) {
  // Nombre de la ciudad
  document.querySelector(".city-name h1").textContent = city.name;

  // Imagen
  const cityImage = document.querySelector(".image-city img");
  cityImage.src = city.image.img;
  cityImage.alt = city.name;

  // Fotógrafo de la imagen
  document.querySelector(".photographer-image").textContent = "© " + city.image.photographer;
}

/*********************************SCORES**********************************************************/
/**
 * Muestra los índices de caliad (scores) de la ciudad
 */
function showScoresCity(city) {
  const container = document.querySelector("section#city-scores div");
  const template = document.querySelector("#quality-template");

  for (const score of city.scores) {
    const clonedContent = template.content.cloneNode(true);

    // Obtenemos los elementos del clon:
    // Título, puntuación y barra de puntuación
    const titleElement = clonedContent.querySelector(".quality-title");

    // Inicializamos el tooltip
    const title = createTooltip(city.details[score.name]);
    new bootstrap.Tooltip(titleElement, { title: title });

    const punElement = clonedContent.querySelector(".quality-punctuation");
    const barElement = clonedContent.querySelector(".quality-bar div");

    // Incoporamos la información al clon
    titleElement.textContent = score.name;
    punElement.textContent = Math.round(score.score_out_of_10);
    barElement.style.backgroundColor = score.color;
    barElement.style.width = score.score_out_of_10 * 10 + "%";

    // Añadimos al container el clon creado
    container.appendChild(clonedContent);
  }
}

/**
 * Genera el tooltip para un determinado 'score'
 */
function createTooltip(data) {
  if (!data) { 
    return "no data";
  }

  let tooltip = "<div>";
  for (const d of data) {
    tooltip += `<div class="row">
                 <div class="col text-start">${d.label}</div>
                 <div class="col-md-auto">${d.value.toFixed(2)}</div>
                </div>`;
  }
  tooltip += "</div>";
  return tooltip;
}

/*********************************MAPA LOCALIZACIÓN***********************************************/

// Mapa Leaflet
function showMap(location) {
  const latitude = location.latitude;
  const longitude = location.longitude;
  const map = L.map("map").setView([latitude, longitude], 4);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("A pretty CSS popup.<br> Easily customizable.");
}
