/**
 * Muestra en una tabla, los datos del coste de vida pasados como parámetro
 */
export function showCostOfLiving(costOfLiving, idColumn, isAscending) {
  // Ordenamos por la columna "idColumn"
  costOfLiving = sortValues(
    costOfLiving,
    idColumn,
    isAscending,
    idColumn === "price" ? true : false
  );
  
  // Obtenemos la tabla para ir añadiendo las filas
  const tableCost = document.querySelector("#cost-of-living tbody");
  for (const cost of costOfLiving) {
    const tr = document.createElement("tr");

    // Recuperamos el item
    const tdCost = document.createElement("td");
    tdCost.textContent = cost.item;
    tr.appendChild(tdCost);

    // Recuperamos el precio
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    const tdPrice = document.createElement("td");
    tdPrice.textContent = formatter.format(cost.price);

    // Añadimos la fila a la tabla
    tr.appendChild(tdPrice);
    tableCost.appendChild(tr);
  }
  // Actualizamos el estilo del icono de orden de columnas
  updateOrderIcon("cost-of-living", idColumn);
}

/**
 * Muestra en una tabla, los salarios por profesión recibidos como parámetro
 */
export function showSalaries(salaries, idColumn, isAscending) {
  // Ordenamos por la columna "idColumn"
  salaries = sortValues(salaries, idColumn, isAscending, idColumn === "salary" ? true : false);

  // Obtenemos la tabla de salarios para ir añadiendo las filas
  const tableSalaries = document.querySelector("#salaries tbody");
  for (const salary of salaries) {
    const tr = document.createElement("tr");

    // Profesión
    const tdJob = document.createElement("td");
    tdJob.textContent = salary.job;
    tr.appendChild(tdJob);

    // Salario
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    const tdSalary = document.createElement("td");
    tdSalary.textContent = formatter.format(salary.salary);
    tr.appendChild(tdSalary);
    tableSalaries.appendChild(tr);
  }
  // Actualizamos el estilo del icono de orden de columnas
  updateOrderIcon("salaries", idColumn);
}

/**
 * Asocia el evento 'clic' a una columna cabecera de una tabla, para poder ordenarla
 */
export function addSortListener(idTable, idColumn, isAsc, showTable, values) {
  let isAscending = isAsc;
  const th = document.querySelector(`#${idTable} thead #th-${idColumn}`);
  th.addEventListener("click", () => {
    // Actualizamos la variable para la próxima vez que se haga clic para ordenar
    isAscending = !isAscending;

    // Eliminamos las filas de la tabla
    const tbody = document.querySelector(`#${idTable} tbody`);
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Mostramos la tabla con las nuevas filas ordenadas
    showTable(values, idColumn, isAscending);
  });
}

/**********************************FUNCIONES PRIVADAS*********************************************/
/**
 * Ordena los valores (ascendente o descendentemente) recibidos como parámetro
 */
function sortValues(values, idColumn, isAscending, isCurrency) {
  if (isCurrency) {
    values.sort((a, b) => (isAscending ? b[idColumn] - a[idColumn] : a[idColumn] - b[idColumn]));
  } else {
    values.sort((a, b) =>
      isAscending ? a[idColumn].localeCompare(b[idColumn]) : b[idColumn].localeCompare(a[idColumn])
    );
  }
  return values;
}

/**
 * Actualiza el estilo del icono de ordenación, situado en la cabecera de una columna
 */
const updateOrderIcon = (idTable, idColumn) => {
  // Obtenemos la columna cabecera donde se encuentra el icono de ordenación
  const th = document.querySelector(`#${idTable} thead #th-${idColumn}`);
  th.classList.toggle("descending");

  // Si el icono no sestá activo lo activamos
  if (th.classList.contains("disable")) {
    th.classList.remove("disable");
  }

  // Modificamos el estilo del icono de ordenación del resto de columnas
  document.querySelector(`#${idTable} thead th:not(#th-${idColumn})`).classList.add("disable");
};
