// This runs in the context of an AA home page, scrapes the balance, sends a message.
(function() {
  const config = {
    programKey: "American_Airlines_AAdvantage",
    displayName: "American Airlines",
    selectors: {
      balance: '.account-container .member-info--miles'
    },
    parsers: {
      balance: (balanceElem) => {
        const rawBalance = balanceElem.textContent.trim();
        console.log("[AA Content Script] Raw balance text:", rawBalance);
        const numericBalance = parseInt(rawBalance.replace(/[^0-9]/g, ""), 10);
        console.log("[AA Content Script] Parsed numeric balance:", numericBalance);
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
    console.log(`[AA Content Script] Attempt #${attempts} to find balance element...`);

    const balanceElem = document.querySelector(config.selectors.balance);
    if (balanceElem) {
      console.log("[AA Content Script] Found balance element!");

      const numericBalance = config.parsers.balance(balanceElem);

      if (!isNaN(numericBalance)) {
        console.log(`[AA Content Script] Balance parsed: ${numericBalance}. Sending to background...`);

        // Send to background script
        chrome.runtime.sendMessage({
          type: "UPDATE_BALANCE",
          programKey: config.programKey,
          newBalance: numericBalance,
          displayName: config.displayName
        }, (response) => {
          console.log("[AA Content Script] Background responded:", response);
        });

        // Stop polling since we've successfully sent the balance
        clearInterval(intervalId);
      } else {
        console.log("[AA Content Script] Parsed balance is NaN. Retrying...");
      }
    } else {
      console.log("[AA Content Script] Balance element not found. Retrying...");
    }

    // If maximum attempts reached, stop polling
    if (attempts >= MAX_ATTEMPTS) {
      console.log("[AA Content Script] Maximum attempts reached. Giving up on scraping balance.");
      clearInterval(intervalId);
    }
  }, INTERVAL_MS);
})();
