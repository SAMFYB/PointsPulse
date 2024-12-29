// This runs in the context of a Hilton page, scrapes the balance, sends a message.
(function() {
  const config = {
    programKey: "hiltonHonors",
    displayName: "Hilton Honors",
    selectors: {
      balance: 'div[data-testid="honorsPointsBlock"]'
    },
    parsers: {
      balance: (balanceElem) => {
        if (!balanceElem) {
          console.log("[Hilton Content Script] Hilton points balance element not found.");
          return NaN;
        }

        // Select the <span> with class 'font-headline' containing the points value
        const pointsSpan = balanceElem.querySelector('span.font-headline');

        if (pointsSpan) {
          const rawBalance = pointsSpan.textContent.trim();
          console.log("[Hilton Content Script] Raw balance text:", rawBalance);

          // Remove commas and parse to integer
          const numericBalance = parseInt(rawBalance.replace(/,/g, ''), 10);
          console.log("[Hilton Content Script] Parsed numeric balance:", numericBalance);

          return numericBalance;
        } else {
          console.log("[Hilton Content Script] Points span not found within the balance element.");
          return NaN;
        }
      }
    }
  };

  // Polling configuration
  let attempts = 0;
  const MAX_ATTEMPTS = 20;       // Maximum number of polling attempts
  const INTERVAL_MS = 500;       // Interval between attempts in milliseconds

  const intervalId = setInterval(() => {
    attempts++;
    console.log(`[Hilton Content Script] Attempt #${attempts} to find balance element...`);

    const balanceElem = document.querySelector(config.selectors.balance);
    if (balanceElem) {
      console.log("[Hilton Content Script] Found balance element!");

      const numericBalance = config.parsers.balance(balanceElem);

      if (!isNaN(numericBalance)) {
        console.log(`[Hilton Content Script] Balance parsed: ${numericBalance}. Sending to background...`);

        // Send to background script
        chrome.runtime.sendMessage({
          type: "UPDATE_BALANCE",
          programKey: config.programKey,
          newBalance: numericBalance,
          displayName: config.displayName
        }, (response) => {
          console.log("[Hilton Content Script] Background responded:", response);
        });

        // Stop polling since we've successfully sent the balance
        clearInterval(intervalId);
      } else {
        console.log("[Hilton Content Script] Parsed balance is NaN. Retrying...");
      }
    } else {
      console.log("[Hilton Content Script] Balance element not found. Retrying...");
    }

    // If maximum attempts reached, stop polling
    if (attempts >= MAX_ATTEMPTS) {
      console.log("[Hilton Content Script] Maximum attempts reached. Giving up on scraping balance.");
      clearInterval(intervalId);
    }
  }, INTERVAL_MS);
})();
