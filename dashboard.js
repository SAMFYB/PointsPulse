// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["programData"], (result) => {
    const programData = result.programData || {};

    // We will collect data for display
    const programNames = [];
    const latestBalances = [];
    const tableRows = [];

    // For each program in programData, we want the latest entry from history
    Object.keys(programData).forEach((programKey) => {
      const { displayName, history } = programData[programKey];
      if (!history || history.length === 0) return; // skip if no history

      // Last entry is the latest snapshot
      const lastEntry = history[history.length - 1];
      const dateStr = new Date(lastEntry.timestamp).toLocaleString();

      // Prepare for the table
      tableRows.push(`
        <tr>
          <td>${displayName}</td>
          <td>${lastEntry.balance}</td>
          <td>${dateStr}</td>
        </tr>
      `);

      // For chart data
      programNames.push(displayName);
      latestBalances.push(lastEntry.balance);
    });

    // Render the table
    const balancesDiv = document.getElementById("balances");
    if (tableRows.length > 0) {
      balancesDiv.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Program</th>
              <th>Balance</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
      `;
    } else {
      balancesDiv.innerHTML = `<p>No balances found yet. Visit your loyalty sites!</p>`;
    }

    // Build the chart
    const ctx = document.getElementById("balanceChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: programNames,
        datasets: [{
          label: "Points/Miles",
          data: latestBalances,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
});
