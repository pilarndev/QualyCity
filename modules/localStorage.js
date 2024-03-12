export function getFavorites() {
  let strFavoritos = localStorage.getItem("favoritos");
  return strFavoritos ? JSON.parse(strFavoritos) : [];
}

export function setFavorite(value) {
  let arrFavorites = getFavorites();
  if (isFavorite(value)) return;

  arrFavorites.push({
    name: value.name,
    code: value.code,
    img: value.img,
  });
  localStorage.setItem("favoritos", JSON.stringify(arrFavorites));
}

export function deleteFavorite(key) {
  let arrFavorites = getFavorites();
  arrFavorites = arrFavorites.filter((favorite) => favorite.code !== key);
  localStorage.setItem("favoritos", JSON.stringify(arrFavorites));
}

export function isFavorite(key) {
  let arrFavorites = getFavorites();
  return arrFavorites.some((favorite) => favorite.code === key);
}
