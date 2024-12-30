// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["programData"], (result) => {
    const programData = result.programData || {};

    // 1. Hardcoded Valuation Data (Valuation per point/mile)
    const valuationData = {
      amexRewards: 0.01,        // $0.01 per point
      deltaAirlines: 0.015,     // $0.015 per mile
      hiltonHonors: 0.005,      // $0.005 per point
      // Add other programs and their valuations here
    };

    // 2. Hardcoded Valuation Update Timestamp
    const valuationUpdateTimestamp = "2024-04-25 10:30 AM"; // Update this manually as needed

    // 3. We will collect data for display
    const tableRows = [];

    // For each program in programData, we want the latest entry from history
    Object.keys(programData).forEach((programKey) => {
      const { displayName, history } = programData[programKey];
      if (!history || history.length === 0) return; // skip if no history

      // Last entry is the latest snapshot
      const lastEntry = history[history.length - 1];
      const dateStr = new Date(lastEntry.timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // Use 12-hour format (AM/PM)
      });

      // Retrieve the valuation for the program; default to 0 if not defined
      const valuationPerPoint = valuationData[programKey] || 0;
      const valuationFormatted = valuationPerPoint > 0 ? `$${valuationPerPoint.toFixed(4)}` : "N/A";

      // Calculate the total worth
      const totalWorth = valuationPerPoint > 0 ? (lastEntry.balance * valuationPerPoint) : 0;
      const totalWorthFormatted = valuationPerPoint > 0 ? `$${totalWorth.toFixed(2)}` : "N/A";

      // Prepare for the table with new columns inserted between Balance and Last Updated
      tableRows.push(`
        <tr data-program-key="${programKey}">
          <td>${displayName}</td>
          <td>${Number(lastEntry.balance).toLocaleString('en-US')}</td>
          <td>${valuationFormatted}</td>
          <td>${totalWorthFormatted}</td>
          <td>${dateStr}</td>
        </tr>
      `);
    });

    // 4. Render the table
    const balancesDiv = document.getElementById("balances");
    if (tableRows.length > 0) {
      balancesDiv.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Program</th>
              <th>Balance</th>
              <th>Valuation</th>
              <th>Total Worth</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
        <p style="text-align: center; margin-top: 20px; font-size: 1em; color: #555;">
          Valuation data last updated on ${valuationUpdateTimestamp}
        </p>
      `;

      // Add click event listeners to each row
      const rows = balancesDiv.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        row.addEventListener('click', () => {
          const programKey = row.getAttribute('data-program-key');
          if (programKey) {
            // Navigate to history.html with the programKey as a query parameter
            const historyPage = `history.html?program=${encodeURIComponent(programKey)}`;
            window.location.href = historyPage;
          }
        });
      });
    } else {
      balancesDiv.innerHTML = `<p>No balances found yet. Visit your loyalty sites!</p>`;
    }
  });
});
