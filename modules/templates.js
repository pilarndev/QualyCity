const path = "../templates/templates.html";

export async function appendHeader() {
  const template = document.createElement("template");
  const response = await fetch(path);
  template.innerHTML = await response.text();
  const footer = template.content.querySelector("#template-header").content;
  document.querySelector("#header").appendChild(footer);
}

export async function appendFooter() {
  const template = document.createElement("template");
  const response = await fetch(path);
  template.innerHTML = await response.text();
  const footer = template.content.querySelector("#template-footer").content;
  document.querySelector("#footer").appendChild(footer);
}
