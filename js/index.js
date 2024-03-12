import { getContinentsAPI } from "../modules/model/api.js";
import { appendFooter, appendHeader } from "../modules/templates.js";"../modules/templates.js";
import { getNameCities, clearSuggestionsNameCities } from "../modules/index/searchControl.js";
import { showContinents } from "../modules/index/continents.js";

/*********************************CABECERA Y PIE**************************************************/

appendFooter();
appendHeader();

/*********************************SECCIÓN DE BÚSQUEDA*********************************************/

// Recuperamos el campo de texto utilizado para la búsqueda
const searchInput = document.querySelector("#search-input");

// Añadimos el evento 'keydown'
searchInput.addEventListener("keydown", debounce(getNameCities));

// Añadimos el evento 'input' para saber cuando cambia el texto
const iconRemove =  document.querySelector("#search-icon-remove");
searchInput.addEventListener("input", function() {
  iconRemove.classList.add("active");
});

// Añadimos el evento 'click' a la X del campo de búsqueda para limpiarlo
iconRemove.addEventListener("click", function() {
  clearSuggestionsNameCities();
  this.classList.remove("active")
  searchInput.value = "";
});

/**
 * Retrasa la ejecución de la función pasada como parámetro
 */
function debounce(func, timeout = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/****************************SECCIÓN DE LOS CONTINENTES CON LAS CIUDADES**************************/

/**
 * Obtiene los continentes y muestra las ciudades de Europa
 */
async function getContinents() {
  // Recuperamos los datos de la API
  const continents = await getContinentsAPI();

  // Mostramos los continentes
  showContinents(continents);

  // Simulamos el click en el continente de Europa para listar sus ciudades
  document.querySelector(`#btn-${continents.find(c=>c.name==="Europe").code}`).click();
}
getContinents();