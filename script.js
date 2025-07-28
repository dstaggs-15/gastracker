const form = document.getElementById("fuel-form");
const tableBody = document.querySelector("#log-table tbody");

let entries = JSON.parse(localStorage.getItem("fuelEntries")) || [];

form.addEventListener("submit", e => {
  e.preventDefault();

  const car = document.getElementById("carName").value;
  const date = document.getElementById("date").value;
  const odometer = parseFloat(document.getElementById("odometer").value);
  const gallons = parseFloat(document.getElementById("gallons").value);
  const price = parseFloat(document.getElementById("price").value);

  let mpg = 0;
  if (entries.length > 0) {
    const lastEntry = entries[entries.length - 1];
    if (lastEntry.car === car) {
      mpg = (odometer - lastEntry.odometer) / gallons;
    }
  }

  const entry = { car, date, odometer, gallons, price, mpg: mpg.toFixed(2) };
  entries.push(entry);
  localStorage.setItem("fuelEntries", JSON.stringify(entries));

  form.reset();
  renderTable();
});

function renderTable() {
  tableBody.innerHTML = "";
  entries.forEach(e => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.car}</td>
      <td>${e.date}</td>
      <td>${e.odometer}</td>
      <td>${e.gallons}</td>
      <td>$${e.price}</td>
      <td>${e.mpg || "-"}</td>
    `;
    tableBody.appendChild(row);
  });
}

renderTable();
