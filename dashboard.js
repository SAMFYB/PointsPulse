// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["programData"], (result) => {
    const programData = result.programData || {};

    // We will collect data for display
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

      // Prepare for the table
      tableRows.push(`
        <tr data-program-key="${programKey}">
          <td>${displayName}</td>
          <td>${Number(lastEntry.balance).toLocaleString('en-US')}</td>
          <td>${dateStr}</td>
        </tr>
      `);
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
