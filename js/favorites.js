import { appendFooter, appendHeader } from "../modules/templates.js";
import { deleteFavorite, getFavorites } from "../modules/localStorage.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

/********************************CABECERA Y PIE***************************************************/

appendFooter();
appendHeader();

/*********************************FAVORITOS*******************************************************/

// Recuperamos el template para el favorito y el contenedor donde mostraremos los favoritos
const templateFav = document.querySelector("#favorite");
const container = document.querySelector(".favorites");

// Recuperamos del "localStorage" las ciudades favoritas para mostrarlas
const favorites = getFavorites().sort((a, b) => a.name.localeCompare(b.name));
favorites.forEach((city) => {
  // Creamos el clon
  const clonedContent = templateFav.content.cloneNode(true);

  // Enlace a la información de la ciudad
  const a = clonedContent.querySelector("a");
  a.href = `cities.html?q=${city.code}`;

  // Imagen asociada a la ciudad
  const cityImage = clonedContent.querySelector(".favorite-image");
  cityImage.src = city.img;
  cityImage.alt = city.name;

  // Nombre de la ciudad
  const nameCity = clonedContent.querySelector(".name");
  nameCity.textContent = city.name;

  // Obtenemos el elemento de la papelera
  const trash = clonedContent.querySelector(".trash");
  
  //Inicializamos su tooltip
  new bootstrap.Tooltip(trash);
  
  // Asociamos el evento para poder borrar el favorito
  trash.addEventListener("click", function () {
    // Eliminamos el favorito del "localStorage"
    deleteFavorite(city.code);

    // Hacemos que el favorito desaparezca lentamente
    const node = this.parentNode.parentNode;
    node.classList.add("fade-out");
    node.addEventListener("transitionend", () => {
      node.classList.remove("fade-out");
      node.remove();
    });
  });

  // Añadimos el favorito al contenedor de favoritos
  container.appendChild(clonedContent);
});