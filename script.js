let vehicles = JSON.parse(localStorage.getItem("vehicles")) || ["Default Car"];
let selectedVehicle = localStorage.getItem("selectedVehicle") || vehicles[0];
let fuelData = JSON.parse(localStorage.getItem(selectedVehicle)) || [];

function saveData(date, odometer, gallons, price) {
  fuelData.push({ date, odometer: +odometer, gallons: +gallons, price: +price });
  fuelData.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem(selectedVehicle, JSON.stringify(fuelData));
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#logTable tbody");
  tbody.innerHTML = "";
  let prevOdo = null;

  fuelData.forEach(entry => {
    const tr = document.createElement("tr");
    const mpg = prevOdo !== null ? ((entry.odometer - prevOdo) / entry.gallons).toFixed(2) : "-";
    prevOdo = entry.odometer;

    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.odometer}</td>
      <td>${entry.gallons}</td>
      <td>$${entry.price.toFixed(2)}</td>
      <td>${mpg}</td>
    `;
    tbody.appendChild(tr);
  });
}

function populateVehicleDropdown() {
  const select = document.getElementById("vehicleSelect");
  select.innerHTML = "";
  vehicles.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    if (v === selectedVehicle) opt.selected = true;
    select.appendChild(opt);
  });
}

function addVehicle() {
  const newVehicle = prompt("Enter new vehicle name:");
  if (newVehicle && !vehicles.includes(newVehicle)) {
    vehicles.push(newVehicle);
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    localStorage.setItem("selectedVehicle", newVehicle);
    selectedVehicle = newVehicle;
    fuelData = [];
    localStorage.setItem(selectedVehicle, JSON.stringify([]));
    populateVehicleDropdown();
    renderTable();
  }
}

document.getElementById("vehicleSelect").addEventListener("change", function () {
  selectedVehicle = this.value;
  localStorage.setItem("selectedVehicle", selectedVehicle);
  fuelData = JSON.parse(localStorage.getItem(selectedVehicle)) || [];
  renderTable();
});

document.getElementById("fuelForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const odometer = document.getElementById("odometer").value;
  const gallons = document.getElementById("gallons").value;
  const price = document.getElementById("price").value;
  saveData(date, odometer, gallons, price);
  this.reset();
});

populateVehicleDropdown();
renderTable();
