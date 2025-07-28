const vehicles = JSON.parse(localStorage.getItem("vehicles")) || ["Default Car"];
const selectedVehicle = localStorage.getItem("selectedVehicle") || vehicles[0];
document.getElementById("currentCar").textContent = selectedVehicle;

const fuelData = JSON.parse(localStorage.getItem(selectedVehicle)) || [];

function getMPGData() {
  const labels = [];
  const mpgValues = [];
  let prevOdo = null;

  const sorted = fuelData.sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(entry => {
    if (prevOdo !== null && entry.gallons > 0) {
      const miles = entry.odometer - prevOdo;
      const mpg = miles / entry.gallons;
      labels.push(entry.date);
      mpgValues.push(+mpg.toFixed(2));
    }
    prevOdo = entry.odometer;
  });

  return { labels, mpgValues };
}

function renderChart() {
  const { labels, mpgValues } = getMPGData();

  new Chart(document.getElementById("mpgChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "MPG Over Time",
        data: mpgValues,
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "MPG"
          }
        },
        x: {
          title: {
            display: true,
            text: "Date"
          }
        }
      }
    }
  });
}

function renderSummary() {
  const totalMiles = fuelData.at(-1)?.odometer - fuelData[0]?.odometer || 0;
  const totalGallons = fuelData.reduce((sum, e) => sum + parseFloat(e.gallons || 0), 0);
  const totalCost = fuelData.reduce((sum, e) => sum + parseFloat(e.price || 0), 0);
  const avgMPG = totalGallons > 0 ? totalMiles / totalGallons : 0;

  const list = document.getElementById("summaryList");
  list.innerHTML = `
    <li>Total Miles: ${totalMiles.toFixed(1)}</li>
    <li>Total Gallons: ${totalGallons.toFixed(2)}</li>
    <li>Total Cost: $${totalCost.toFixed(2)}</li>
    <li>Average MPG: ${avgMPG.toFixed(2)}</li>
  `;
}

renderChart();
renderSummary();
