import { City } from "./city.js";
import { CityUA } from "./cityUa.js";
import { Continent } from "./continent.js";

// URLs API
const apiUrlTeleport = "https://api.teleport.org/api/";
const apiUrlWikiVoyage = "https://en.wikivoyage.org/w/api.php";

/**
 * Obtiene los nombres de las ciudades que coinciden con la búsqueda (a través de la API de Teleport)
 */
export async function getNamesCitiesAPI(searchText) {
  const normalize = (texto) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const endPoint = `${apiUrlTeleport}urban_areas?embed=ua:item&embed=ua:item/ua:identifying-city&droplinks=true`;

  try {
    const response = await fetch(endPoint);
    const data = await response.json();
    const cities = data._embedded["ua:item"].map((ua) => new City(ua));

    // Retornamos las ciudades que coinciden con la búsqueda
    return cities.filter(
      (city) => normalize(city.name).match(new RegExp(`^${normalize(searchText)}`))
      //c.fullName.startsWith(searchText);
    );
  } catch (error) {
    console.error(error);
  }
}

/**
 * Obtiene los continentes (a través de la API de Teleport)
 */
export async function getContinentsAPI() {
  const endPoint = `${apiUrlTeleport}continents/?embed=continent:items/continent:urban_areas&droplinks=true`;
  try {
    // Recuperamos los datos de la API
    const response = await fetch(endPoint);
    const data = await response.json();
    const continents = data._embedded["continent:items"];

    // Filtramos solo los continentes que tienen ciudades con datos
    const continentsWithCities = continents.filter((c) => {
      return c._embedded["continent:urban_areas"].count > 0;
    });

    // Retornamos los continentes
    return continentsWithCities.map((c) => new Continent(c.name, c.geonames_code));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Obtiene las ciudades de un continente determinado (a través de la API de Teleport)
 */
export async function getCitiesByContinentAPI(continentCode) {
  const endPoint = `${apiUrlTeleport}continents/geonames:${continentCode}/urban_areas?embed=ua:items&embed=ua:items/ua:identifying-city&droplinks=true`;
  try {
    // Recuperamos los datos de la API
    const response = await fetch(endPoint);
    const data = await response.json();

    // Retornamos las ciudades del continente pasado como parámetro
    return data._embedded["ua:items"].map((ua) => new City(ua));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Obtiene los datos de una ciudad determinada (a través de la API de Teleport)
 */
export async function getDataCityByCodeAPI(cityCode) {
  const endPoint = `${apiUrlTeleport}/urban_areas/slug:${cityCode}/?embed=ua:identifying-city&embed=ua:identifying-city/city:country&embed=ua:identifying-city/city:admin1_division&embed=ua:images&embed=ua:scores&embed=ua:details&embed=ua:salaries&embed=ua:identifying-city&droplinks=true`;
  try {
    // Recuperamos la información de la API
    const response = await fetch(endPoint);
    const data = await response.json();

    // Retornamos la información de la ciudad pasada como parámetro
    return new CityUA(data);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Obtiene la información asociada a una ciudad (a través de la API de wikipedia)
 */
export async function getDescCityAPI(city, division) {
   const getDescCity = async (searchTerm) => {
    const endPoint = `${apiUrlWikiVoyage}?action=query&origin=*&format=json&prop=extracts&exintro&titles=${encodeURIComponent(
      searchTerm
    )}&redirects`;
   
    try {
      // Recuperamos la información de la API
      const response = await fetch(endPoint);
      const data = await response.json();

      const pages = data.query.pages;
      const firstPageId = Object.keys(pages)[0];

      // Retornamos la información
      return pages[firstPageId].extract;
    } catch (error) {
      throw error;
    }
  };

  // Fallback
  try {
    let data = await getDescCity(`${city} (${division})`);
    if (!data) {
      data = await getDescCity(city);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}
