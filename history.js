// history.js

/**
 * Parses the query parameters from the URL.
 * @returns {Object} An object containing key-value pairs of query parameters.
 */
function parseQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");
  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });
  return params;
}

/**
 * Displays the historical balance data for the selected program.
 * @param {string} programKey - The unique key of the loyalty program.
 */
function displayHistoricalData(programKey) {
  chrome.storage.local.get(["programData"], (result) => {
    const programData = result.programData || {};

    if (!programData[programKey]) {
      document.getElementById("history").innerHTML = `<p>Program data not found.</p>`;
      return;
    }

    const { displayName, history } = programData[programKey];

    // Update the program name in the header
    document.getElementById("program-name").textContent = `${displayName} - Balance History`;

    if (!history || history.length === 0) {
      document.getElementById("history").innerHTML = `<p>No historical data available for this program.</p>`;
      return;
    }

    // Sort history by timestamp descending (latest first)
    const sortedHistory = history.slice().sort((a, b) => b.timestamp - a.timestamp);

    // Create table rows for historical data
    const tableRows = sortedHistory.map((entry) => {
      const dateStr = new Date(entry.timestamp).toLocaleString('en-US', {
        year: '2-digit',       // e.g., "24" instead of "2024"
        month: '2-digit',      // e.g., "12" instead of "December"
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const balanceFormatted = typeof entry.balance === 'number' ?
        entry.balance.toLocaleString('en-US') :
        entry.balance; // Handle if balance is a number or string

      return `
        <tr>
          <td>${dateStr}</td>
          <td>${balanceFormatted}</td>
        </tr>
      `;
    });

    // Render the historical data table
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Updated</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.join("")}
        </tbody>
      </table>
    `;
  });
}

// On DOM load
document.addEventListener("DOMContentLoaded", () => {
  const params = parseQueryParams();
  const programKey = params.program;

  if (programKey) {
    displayHistoricalData(programKey);
  } else {
    document.getElementById("history").innerHTML = `<p>No program specified.</p>`;
  }
});
