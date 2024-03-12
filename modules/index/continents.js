import { getCitiesByContinentAPI } from "../model/api.js";

/**
 * Muestra los nombres de los continentes
 */
export function showContinents(continents) {
  const divContinents = document.querySelector(".content-continents");

  // Para cada continente creamos su botón y el div que contendrá sus ciudades
  continents.forEach((dataElement) => {
    // Creamos el botón para el continente
    const button = document.createElement("button");
    button.id = `btn-${dataElement.code}`;
    button.classList.add("btn");
    button.type = "button";
    button.textContent = dataElement.name;

    // Asociamos el evento de click al botón del continente
    button.addEventListener("click", () => {
      getCitiesByContinent(dataElement.code);
      changeVisibility(dataElement.code, divContinents);

      // Ponemos como selecccionado el botón del continente
      button.classList.add("active");
     
      // Quitamos la clase de 'selected' del resto de botones de continentes
      document.querySelectorAll(`button:not([id='${button.id}'])`).forEach((otherButton) => {
        otherButton.classList.remove("active");
      });
    });

    // Creamos el div donde se mostraran las ciudades del continente
    const divContentCities = document.querySelector(".content-cities");
    const divCitiesContinent = document.createElement("div");

    divCitiesContinent.id = dataElement.code;
    divCitiesContinent.classList.add("columns");
    divContentCities.appendChild(divCitiesContinent);
    divContinents.appendChild(button);
  });
}

/**********************************FUNCIONES PRIVADAS*********************************************/
/**
 * Obtiene las ciudades de un continente pasado como parámetro
 */
async function getCitiesByContinent(continentCode) {
  // Si ya tenemos las ciudades "cargadas" no hacemos la llamada a la API
  if (document.querySelector(`#${continentCode}`).childNodes.length) {
    return;
  }
  // Recuperamos los datos de la API
  const cities = await getCitiesByContinentAPI(continentCode);

  // Cargamos las ciudades del continente
  loadCities(cities, continentCode);
}

/**
 * Crea el elemento hmtl que contendrá las ciudades de un continente
 */
function loadCities(cities, continentCode) {
  const div = document.querySelector(`#${continentCode}`);
  cities.forEach((dataElement) => {
    const a = document.createElement("a");
    a.textContent = dataElement.name;
    a.href = `cities.html?q=${dataElement.slug}`;
    div.appendChild(a);
  });
}

/**
 * Hace visible el elemento html que continene las ciudades de un continente
 */
function changeVisibility(continentCode) {
  const contentCities = document.querySelector(".content-cities");

  // Ponemos como visible el elemento que contiene las ciudades del contiente
  const continent = contentCities.querySelector(`#${continentCode}`);
  continent.classList.remove("hidden");

  // Ocultamos los elementos que contienen las ciudades de los otros continentes
  const otherContinents = contentCities.querySelectorAll(`div:not([id='${continentCode}'])`);
  otherContinents.forEach((continent) => {
    continent.classList.add("hidden");
  });
}
