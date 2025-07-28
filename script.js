let selectedVehicle = localStorage.getItem("selectedVehicle") || "Default Car";
let fuelData = JSON.parse(localStorage.getItem(selectedVehicle)) || [];

function saveData(date, odometer, gallons, price) {
  const entry = {
    date,
    odometer: parseFloat(odometer),
    gallons: parseFloat(gallons),
    price: parseFloat(price)
  };

  fuelData.push(entry);
  localStorage.setItem(selectedVehicle, JSON.stringify(fuelData));
  renderTable();
  calculateStats();
}

function renderTable() {
  const tbody = document.querySelector("#logTable tbody");
  tbody.innerHTML = "";
  fuelData.sort((a, b) => new Date(a.date) - new Date(b.date));

  for (let i = 1; i < fuelData.length; i++) {
    const prev = fuelData[i - 1];
    const current = fuelData[i];
    const miles = current.odometer - prev.odometer;
    const mpg = (miles / current.gallons).toFixed(2);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${current.date}</td>
      <td>${current.odometer}</td>
      <td>${current.gallons}</td>
      <td>${current.price}</td>
      <td>${mpg}</td>
    `;
    tbody.appendChild(row);
  }
}

function calculateStats() {
  let totalMiles = 0, totalGallons = 0, totalCost = 0;

  for (let i = 1; i < fuelData.length; i++) {
    const miles = fuelData[i].odometer - fuelData[i - 1].odometer;
    totalMiles += miles;
    totalGallons += fuelData[i].gallons;
    totalCost += fuelData[i].price;
  }

  const avgMPG = totalGallons > 0 ? (totalMiles / totalGallons).toFixed(2) : 0;

  document.getElementById("totalMiles").textContent = `Total Miles: ${totalMiles.toFixed(1)}`;
  document.getElementById("totalGallons").textContent = `Total Gallons: ${totalGallons.toFixed(2)}`;
  document.getElementById("totalCost").textContent = `Total Cost: $${totalCost.toFixed(2)}`;
  document.getElementById("averageMPG").textContent = `Average MPG: ${avgMPG}`;
}

function populateVehicleDropdown() {
  const vehicleSelect = document.getElementById("vehicleSelect");
  const keys = Object.keys(localStorage).filter(k => k !== "selectedVehicle");
  vehicleSelect.innerHTML = "";

  keys.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    if (key === selectedVehicle) option.selected = true;
    vehicleSelect.appendChild(option);
  });

  vehicleSelect.onchange = () => {
    selectedVehicle = vehicleSelect.value;
    localStorage.setItem("selectedVehicle", selectedVehicle);
    fuelData = JSON.parse(localStorage.getItem(selectedVehicle)) || [];
    renderTable();
    calculateStats();
  };
}

function addNewVehicle() {
  const name = prompt("Enter vehicle name:");
  if (name && !localStorage.getItem(name)) {
    localStorage.setItem(name, JSON.stringify([]));
    selectedVehicle = name;
    localStorage.setItem("selectedVehicle", selectedVehicle);
    fuelData = [];
    populateVehicleDropdown();
    renderTable();
    calculateStats();
  }
}

document.getElementById("fuelForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const odometer = document.getElementById("odometer").value;
  const gallons = document.getElementById("gallons").value;
  const price = document.getElementById("price").value;
  saveData(date, odometer, gallons, price);
  this.reset();
});

window.onload = () => {
  populateVehicleDropdown();
  renderTable();
  calculateStats();
};
