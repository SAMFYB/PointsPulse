// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["programData"], (result) => {
    const programData = result.programData || {};

    // 1. Hardcoded Valuation Data (Valuation per point/mile);
    // Hardcoded mapping of programKey -> official website URL
    const valuationData = {
      // For credit card points and miles
      American_Express_Membership_Rewards: 2.0,
      Bilt_Rewards: 2.05,
      Capital_One: 1.85,
      Chase_Ultimate_Rewards: 2.05,
      Citi_ThankYou_Rewards: 1.8,
      U_S_Bank_Altitude_Reserve: 1.5,
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
    const valuationUpdateTimestamp = "12/30/2024, 9:30 AM"; // Update this manually as needed

    const programURLs = {
      // For credit card points and miles
      American_Express_Membership_Rewards: "https://global.americanexpress.com/overview",
      Bilt_Rewards: "https://www.biltrewards.com/",
      U_S_Bank_Altitude_Reserve: "https://onlinebanking.usbank.com/digital/servicing/rewards-management",
      // For airline points and miles
      American_Airlines_AAdvantage: "https://www.aa.com/aadvantage-program/profile/account-summary",
      Avios: "",
      Cathay_Asia_Miles: "",
      Delta_Air_Lines_SkyMiles: "https://www.delta.com/myprofile/personal-details",
      United_Airlines_MileagePlus: "https://www.united.com/en/us/myunited",
      // For hotel points
      Hilton_Honors: "https://www.hilton.com/en/hilton-honors/guest/my-account/",
      Marriott_Bonvoy: "https://www.marriott.com/loyalty/myAccount/default.mi",
      World_of_Hyatt: "",
    };

    // 2. Prepare data for display
    let displayData = [];

    Object.keys(programData).forEach((programKey) => {
      const { displayName, history } = programData[programKey];
      if (!history || history.length === 0) return; // Skip if no history

      // Last entry is the latest snapshot
      const lastEntry = history[history.length - 1];
      const dateStr = new Date(lastEntry.timestamp).toLocaleString('en-US', {
        year: '2-digit',       // e.g., "24" instead of "2024"
        month: '2-digit',      // e.g., "12" instead of "December"
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Retrieve the valuation for the program; default to 0 if not defined
      const valuationPerPoint = valuationData[programKey] || 0;
      const valuationFormatted = valuationPerPoint > 0 ? `${valuationPerPoint.toFixed(2)}` : "N/A";

      // Calculate the total worth
      const totalWorth = valuationPerPoint > 0 ? (lastEntry.balance * valuationPerPoint / 100) : 0;
      const totalWorthFormatted = valuationPerPoint > 0 ?
        `$${Number(totalWorth.toFixed(0)).toLocaleString('en-US')}` : "N/A";

      // Retrieve the official URL
      const programURL = programURLs[programKey] || "#"; // fallback if not defined

      // Push the data into displayData array
      displayData.push({
        programKey,
        displayName,
        programURL,
        balance: lastEntry.balance,
        balanceFormatted: Number(lastEntry.balance).toLocaleString('en-US'),
        valuation: valuationPerPoint,
        valuationFormatted,
        totalWorth: totalWorth,
        totalWorthFormatted,
        lastUpdated: lastEntry.timestamp,
        lastUpdatedFormatted: dateStr
      });
    });

    // Function to render the table based on displayData
    function renderTable(data) {
      const tableRows = data.map(item => `
        <tr data-program-key="${item.programKey}">
          <td>
            <a href="${item.programURL}" target="_blank" rel="noopener noreferrer">
              ${item.displayName}
            </a>
          </td>
          <td>${item.balanceFormatted}</td>
          <td>${item.valuationFormatted}</td>
          <td>${item.totalWorthFormatted}</td>
          <td>${item.lastUpdatedFormatted}</td>
        </tr>
      `).join("");

      const balancesDiv = document.getElementById("balances");
      if (tableRows.length > 0) {
        balancesDiv.innerHTML = `
          <table id="balances-table">
            <thead>
              <tr>
                <th data-sort="program">Program</th>
                <th data-sort="balance">Balance</th>
                <th data-sort="valuation">Valuation</th>
                <th data-sort="totalWorth">Total Worth</th>
                <th data-sort="lastUpdated">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <p style="text-align: center; margin-top: 20px; font-size: 1em; color: #495057; /* gray 7 */">
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

        // Add sorting functionality
        addSortingFunctionality();
      } else {
        balancesDiv.innerHTML = `<p>No balances found yet. Visit your loyalty sites!</p>`;
      }
    }

    // Function to add sorting functionality
    function addSortingFunctionality() {
      const headers = document.querySelectorAll('#balances-table thead th');
      headers.forEach(header => {
        header.style.cursor = 'pointer'; // Indicate that headers are clickable
        header.addEventListener('click', () => {
          const sortKey = header.getAttribute('data-sort');
          if (sortKey) {
            sortTableByColumn(sortKey);
          }
        });
      });
    }

    // Function to sort the table data based on a specific column
    function sortTableByColumn(sortKey) {
      switch (sortKey) {
        case 'program':
          displayData.sort((a, b) => a.displayName.localeCompare(b.displayName));
          break;
        case 'balance':
          displayData.sort((a, b) => b.balance - a.balance);
          break;
        case 'valuation':
          displayData.sort((a, b) => b.valuation - a.valuation);
          break;
        case 'totalWorth':
          displayData.sort((a, b) => b.totalWorth - a.totalWorth);
          break;
        case 'lastUpdated':
          displayData.sort((a, b) => b.lastUpdated - a.lastUpdated);
          break;
        default:
          break;
      }

      // Re-render the table with sorted data
      renderTable(displayData);
    }

    // Initial render
    renderTable(displayData);
  });
});
