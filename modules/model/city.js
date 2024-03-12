export class City {
  constructor(json) {
    this.name = json._embedded["ua:identifying-city"].name;
    this.fullName = json._embedded["ua:identifying-city"].full_name;
    this.slug = json.slug;
  }
}
