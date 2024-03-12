import { getNamesCitiesAPI } from "../../modules/model/api.js";

// Recuperamos el campo de texto utilizado para la búsqueda
const searchInput = document.querySelector("#search-input"); 

/**
 * Obtiene los nombres de las ciudades sugeridas en el campo de búsqueda
 */
export async function getNameCities() {
  // Pecuperamos los datos de la API
  const cities = await getNamesCitiesAPI(searchInput.value);

  // Limpiamos los nombres de las ciudades sugeridas
  clearSuggestionsNameCities();

  // Añadimos los nombres de las ciudades sugeridas
  showNameCities(cities);
}

/**
 * Limpia los nombres de las ciudades sugeridas
 */
export function clearSuggestionsNameCities() {
  const listSuggest = document.querySelector("#list-suggest-search");
  while (listSuggest.firstChild) {
    listSuggest.removeChild(listSuggest.firstChild);
  }
  document.querySelector("#suggest-search").classList.remove("active");
  document.querySelector("#input-group-search").classList.remove("active-suggestions");
}

/**********************************FUNCIONES PRIVADAS*********************************************/
/**
 * Añade al campo de búsqueda los nombres de las ciudades sugeridas 
 */
function showNameCities(cities) {
  const inputGroupSearch = document.querySelector("#input-group-search");
  const suggestSearch = document.querySelector("#suggest-search"); 
  const listSuggest = document.querySelector("#list-suggest-search");

  for (const city of cities) {
    const suggest = document.createElement("li");
    suggest.textContent = city.fullName;

    // Asociamos el evento de 'clic' a la ciudad 
    suggest.addEventListener("click", () => {
      searchInput.value = suggest.textContent;
      searchInput.dataset.slug = city.slug;
      suggestSearch.classList.remove("active");
      inputGroupSearch.classList.remove("active-suggestions");
      // Redireccionamos a la página con la información de la ciudad
      window.location.href = `cities.html?q=${city.slug}`;
    });

    // Añadimos las ciudades 
    listSuggest.appendChild(suggest);
    suggestSearch.appendChild(listSuggest);
    suggestSearch.classList.add("active");
  }

  inputGroupSearch.classList.add("active-suggestions");
}