// This runs in the context of an Alaska Airlines page, scrapes the balance, sends a message.
(function() {
  const config = {
    programKey: "Alaska_Airlines_Mileage_Plan",
    displayName: "Alaska Airlines",
    selectors: {
      balance: 'div.mp-info__available-miles'
    },
    parsers: {
      balance: (balanceElem) => {
        const rawBalance = balanceElem.textContent.trim();
        console.log("[Alaska Airlines Content Script] Raw balance text:", rawBalance);
        const numericBalance = parseInt(rawBalance.replace(/[^0-9]/g, ""), 10);
        console.log("[Alaska Airlines Content Script] Parsed numeric balance:", numericBalance);
        return numericBalance;
      }
    }
  };

  // Polling configuration
  let attempts = 0;
  const MAX_ATTEMPTS = 20;       // Maximum number of polling attempts
  const INTERVAL_MS = 500;       // Interval between attempts in milliseconds

  const intervalId = setInterval(() => {
    attempts++;
    console.log(`[Alaska Airlines Content Script] Attempt #${attempts} to find balance element...`);

    const balanceElem = document.querySelector(config.selectors.balance);
    if (balanceElem) {
      console.log("[Alaska Airlines Content Script] Found balance element!");

      const numericBalance = config.parsers.balance(balanceElem);

      if (!isNaN(numericBalance)) {
        console.log(`[Alaska Airlines Content Script] Balance parsed: ${numericBalance}. Sending to background...`);

        // Send to background script
        chrome.runtime.sendMessage({
          type: "UPDATE_BALANCE",
          programKey: config.programKey,
          newBalance: numericBalance,
          displayName: config.displayName
        }, (response) => {
          console.log("[Alaska Airlines Content Script] Background responded:", response);
        });

        // Stop polling since we've successfully sent the balance
        clearInterval(intervalId);
      } else {
        console.log("[Alaska Airlines Content Script] Parsed balance is NaN. Retrying...");
      }
    } else {
      console.log("[Alaska Airlines Content Script] Balance element not found. Retrying...");
    }

    // If maximum attempts reached, stop polling
    if (attempts >= MAX_ATTEMPTS) {
      console.log("[Alaska Airlines Content Script] Maximum attempts reached. Giving up on scraping balance.");
      clearInterval(intervalId);
    }
  }, INTERVAL_MS);
})();
