// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["programData"], (result) => {
    const programData = result.programData || {};

    // 1. Hardcoded Valuation Data (Valuation per point/mile)
    const valuationData = {
      // For credit card points and miles
      American_Express_Membership_Rewards: 2.0,
      Bilt_Rewards: 2.05,
      Capital_One: 1.85,
      Chase_Ultimate_Rewards: 2.05,
      Citi_ThankYou_Rewards: 1.8,
      Wells_Fargo_Rewards: 1.6,
      // For airline points and miles
      Air_Canada_Aeroplan: 1.5,
      Alaska_Airlines_Mileage_Plan: 1.45,
      American_Airlines_AAdvantage: 1.65,
      All_Nippon_Airways_Mileage_Club: 1.4,
      Avianca_LifeMiles: 1.6,
      Avios: 1.4,
      Cathay_Asia_Miles: 1.3,
      Delta_Air_Lines_SkyMiles: 1.2,
      Emirates_Skywards: 1.2,
      Etihad_Airways_Guest: 1.2,
      Flying_Blue: 1.3,
      Frontier_Airlines_Frontier_Miles: 1.1,
      Hawaiian_Airlines_HawaiianMiles: 1.2,
      JetBlue_TrueBlue: 1.3,
      Korean_Air_SkyPass: 1.7,
      Singapore_Airlines_KrisFlyer: 1.3,
      Southwest_Airlines_Rapid_Rewards: 1.4,
      Spirit_Airlines_Free_Spirit: 1.1,
      Turkish_Airlines_Miles_Smiles: 1.2,
      United_Airlines_MileagePlus: 1.35,
      Virgin_Atlantic_Flying_Club: 1.4,
      // For hotel points
      Accor_Live_Limitless: 2.0,
      Best_Western_Rewards: 0.6,
      Choice_Privileges: 0.6,
      Hilton_Honors: 0.6,
      IHG_One_Rewards: 0.5,
      Marriott_Bonvoy: 0.85,
      World_of_Hyatt: 1.7,
      Wyndham_Rewards: 1.1,
    };

    // 2. Hardcoded Valuation Update Timestamp
    const valuationUpdateTimestamp = "12/30/2024, 9:30 AM"; // Update this manually as needed

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
