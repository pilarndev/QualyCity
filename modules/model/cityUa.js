export class CityUA {
  constructor(json) {
    this.name = json._embedded["ua:identifying-city"].name;
    this.fulName = json._embedded["ua:identifying-city"].full_name;
    this.slug = json.slug;
    this.country = json._embedded["ua:identifying-city"]._embedded["city:country"].name;
    this.division = json._embedded["ua:identifying-city"]._embedded["city:admin1_division"].name;
    this.location = json._embedded["ua:identifying-city"].location.latlon;
    this.image = {
      photographer: json._embedded["ua:images"].photos[0].attribution.photographer,
      img: json._embedded["ua:images"].photos[0].image.web,
    };
    this.scores = json._embedded["ua:scores"].categories;
    this.costOfLiving = this.#getCostOfLiving(json);
    this.salaries = this.#getSalaries(json);
    this.details = this.#getDetails(json);
  }

  #getCostOfLiving(json) {
    const costOfLiving = json._embedded["ua:details"].categories.find(
      (element) => element.id === "COST-OF-LIVING"
    );
    return costOfLiving.data
      .filter((element) => element.hasOwnProperty("currency_dollar_value"))
      .map((element) => ({
        item: element.label,
        price: element.currency_dollar_value,
      }));
  }

  #getSalaries(json) {
    return json._embedded["ua:salaries"].salaries.map((element) => ({
      job: element.job.title,
      salary: element.salary_percentiles.percentile_50,
    }));
  }

  #getDetails(json) {
    let details = {};
    const categories = json._embedded["ua:details"].categories;
    for (const categoria of categories) {
      details[categoria.label] = categoria.data
        .filter((d) => d.label.includes("[Teleport score]"))
        .map((c) => ({
          label: c.label.substring(0, c.label.indexOf("[")),
          value: c.float_value //c[Object.keys(c).find((k) => k.includes("value"))].toFixed(2),
        }));
    }
    return details;
  }
}
