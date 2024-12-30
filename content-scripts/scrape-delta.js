// This runs in the context of a Delta page, scrapes the balance, sends a message.
(function() {
  const config = {
    programKey: "Delta_Air_Lines_SkyMiles",
    displayName: "Delta Airlines",
    selectors: {
      balance: 'div.idp-header__medallion-column'
    },
    parsers: {
      balance: (balanceElem) => {
        // Select all <dl> elements within the container
        const dlElements = balanceElem.querySelectorAll('dl.idp-header__medallion-column--child');
        console.log("[Delta Content Script] Found", dlElements.length, "<dl> elements.");

        // Iterate through each <dl> to find the one with <dt> "MILES AVAILABLE"
        for (let dl of dlElements) {
          const dt = dl.querySelector('dt.idp-header__medallion-sub-title');
          if (dt && dt.textContent.trim() === 'MILES AVAILABLE') {
            const dd = dl.querySelector('dd.idp-header__medallion-number-title');
            if (dd) {
              const rawBalance = dd.textContent.trim();
              console.log("[Delta Content Script] Raw balance text:", rawBalance);
              const numericBalance = parseInt(rawBalance.replace(/,/g, ""), 10);
              console.log("[Delta Content Script] Parsed numeric balance:", numericBalance);
              return numericBalance;
            }
          }
        }
        console.log("[Delta Content Script] 'MILES AVAILABLE' section not found within container.");
        return NaN;
      }
    }
  };

  // Polling configuration
  let attempts = 0;
  const MAX_ATTEMPTS = 20;       // Maximum number of polling attempts
  const INTERVAL_MS = 500;       // Interval between attempts in milliseconds

  const intervalId = setInterval(() => {
    attempts++;
    console.log(`[Delta Content Script] Attempt #${attempts} to find balance element...`);

    const balanceElem = document.querySelector(config.selectors.balance);
    if (balanceElem) {
      console.log("[Delta Content Script] Found balance element!");

      const numericBalance = config.parsers.balance(balanceElem);

      if (!isNaN(numericBalance)) {
        console.log(`[Delta Content Script] Balance parsed: ${numericBalance}. Sending to background...`);

        // Send to background script
        chrome.runtime.sendMessage({
          type: "UPDATE_BALANCE",
          programKey: config.programKey,
          newBalance: numericBalance,
          displayName: config.displayName
        }, (response) => {
          console.log("[Delta Content Script] Background responded:", response);
        });

        // Stop polling since we've successfully sent the balance
        clearInterval(intervalId);
      } else {
        console.log("[Delta Content Script] Parsed balance is NaN. Retrying...");
      }
    } else {
      console.log("[Delta Content Script] Balance element not found. Retrying...");
    }

    // If maximum attempts reached, stop polling
    if (attempts >= MAX_ATTEMPTS) {
      console.log("[Delta Content Script] Maximum attempts reached. Giving up on scraping balance.");
      clearInterval(intervalId);
    }
  }, INTERVAL_MS);
})();
