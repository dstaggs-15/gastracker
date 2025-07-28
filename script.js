// Parse data from localStorage
let data = JSON.parse(localStorage.getItem("fuelData")) || [];

function calculateStatsAndGraph() {
  if (data.length < 2) {
    document.getElementById("totalMiles").textContent = "Not enough data";
    document.getElementById("totalGallons").textContent = "-";
    document.getElementById("totalCost").textContent = "-";
    document.getElementById("avgMPG").textContent = "-";
    return;
  }

  let totalMiles = 0;
  let totalGallons = 0;
  let totalCost = 0;
  let mpgPoints = [];
  let dates = [];

  for (let i = 1; i < data.length; i++) {
    let miles = data[i].odometer - data[i - 1].odometer;
    let gallons = parseFloat(data[i].gallons);
    let cost = parseFloat(data[i].price);

    if (miles > 0 && gallons > 0) {
      let mpg = miles / gallons;
      mpgPoints.push(mpg.toFixed(2));
      dates.push(data[i].date);
      totalMiles += miles;
      totalGallons += gallons;
      totalCost += cost;
    }
  }

  // Update stats
  document.getElementById("totalMiles").textContent = totalMiles.toFixed(1);
  document.getElementById("totalGallons").textContent = totalGallons.toFixed(2);
  document.getElementById("totalCost").textContent = totalCost.toFixed(2);
  document.getElementById("avgMPG").textContent = (totalMiles / totalGallons).toFixed(2);

  // Draw line chart for MPG
  const ctx = document.getElementById("mpgChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "MPG Over Time",
        data: mpgPoints,
        borderWidth: 2,
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Miles Per Gallon (MPG)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
}

window.onload = calculateStatsAndGraph;
