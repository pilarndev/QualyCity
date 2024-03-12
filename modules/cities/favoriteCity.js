import { setFavorite, deleteFavorite, isFavorite } from "../localStorage.js";

/**
 * Añade o elimina de la lista de favoritos, la ciudad pasada como parámetro
 */
export function handleFavorite(city) {
  const cityCode = city.slug;

  // Recuperamos el corazon
  const heartIcon = document.querySelector("#heart-icon");

  // Mostramos el corazon
  showHeart(cityCode, heartIcon);

  // Asociamos el evento de click al corazón
  heartIcon.addEventListener("click", function () {
    this.classList.toggle("fas");
    this.classList.toggle("far");
    this.classList.toggle("text-danger");

    if (this.classList.contains("text-danger")) {
      setFavorite({
        name: city.name,
        code: cityCode,
        img: city.image.img,
      });
      showNotification("City saved in favorites");
    } else {
      deleteFavorite(cityCode);
      showNotification("City removed from favorites");
    }
  });
}

/**********************************FUNCIONES PRIVADAS*********************************************/
/**
 * Muestra el corazon pintado o no en función de si la ciudad está como favorita
 */
const showHeart = (cityCode, heartIcon) => {
  // Comprobar si es un favorito, en ese caso "rellenamos" el corazon
  if (isFavorite(cityCode)) {
    heartIcon.classList.add("fas");
    heartIcon.classList.add("text-danger");
  } else {
    heartIcon.classList.add("far");
  }
};

/**
 * Muestra un mensaje cuando se añade o elimina la ciudad de favoritos
 */
const showNotification = (message) => {
  const notification = document.querySelector(".favorite-notification");
  notification.textContent = message;
  notification.classList.add("fade-out");
  notification.addEventListener("transitionend", () => {
    notification.classList.remove("fade-out");
    notification.textContent = "";
  });
};
