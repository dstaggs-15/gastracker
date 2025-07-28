const form = document.getElementById("entryForm");
const tableBody = document.querySelector("#logTable tbody");
const totalMiles = document.getElementById("totalMiles");
const totalGallons = document.getElementById("totalGallons");
const totalCost = document.getElementById("totalCost");
const avgMPG = document.getElementById("avgMPG");
const ctx = document.getElementById("mpgChart").getContext("2d");

let entries = JSON.parse(localStorage.getItem("fuelEntries") || "[]");

function renderTable() {
  tableBody.innerHTML = "";
  let milesSum = 0, gallonsSum = 0, priceSum = 0;
  const labels = [];
  const mpgData = [];

  entries.forEach((entry, index) => {
    const mpg = (entry.miles / entry.gallons).toFixed(2);
    milesSum += entry.miles;
    gallonsSum += entry.gallons;
    priceSum += entry.price;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.miles}</td>
      <td>${entry.gallons}</td>
      <td>$${entry.price.toFixed(2)}</td>
      <td>${mpg}</td>
      <td><button onclick="deleteEntry(${index})">❌</button></td>
    `;
    tableBody.appendChild(row);

    labels.push(entry.date);
    mpgData.push(mpg);
  });

  totalMiles.textContent = milesSum.toFixed(2);
  totalGallons.textContent = gallonsSum.toFixed(2);
  totalCost.textContent = priceSum.toFixed(2);
  avgMPG.textContent = gallonsSum ? (milesSum / gallonsSum).toFixed(2) : 0;

  renderChart(labels, mpgData);
}

function renderChart(labels, data) {
  if (window.mpgChart) window.mpgChart.destroy();
  window.mpgChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "MPG",
        data,
        fill: false,
        borderColor: "blue",
        tension: 0.1
      }]
    }
  });
}

function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem("fuelEntries", JSON.stringify(entries));
  renderTable();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const gallons = parseFloat(document.getElementById("gallons").value);
  const price = parseFloat(document.getElementById("price").value);
  if (!date || isNaN(miles) || isNaN(gallons) || isNaN(price)) return;

  entries.push({ date, miles, gallons, price });
  localStorage.setItem("fuelEntries", JSON.stringify(entries));
  renderTable();
  form.reset();
});

renderTable();
