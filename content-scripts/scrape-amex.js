// This runs in the context of an Amex page, scrapes the balance, sends a message.
(function() {
  const config = {
    programKey: "American_Express_Membership_Rewards",
    displayName: "Membership Rewards",
    selectors: {},
    parsers: {
      balance: () => {
        // Select all reward tiles
        const rewardTiles = document.querySelectorAll('div[data-testid="rewards-tile"]');

        for (let tile of rewardTiles) {
          // Find the button containing the reward title
          const titleButton = tile.querySelector('button[data-testid="rewards-title-button"]');

          if (titleButton) {
            // Extract and clean the title text
            const titleText = titleButton.textContent.trim();

            // Check if the title matches "Membership Rewards® Points"
            if (titleText.includes('Membership Rewards® Points')) {
              // Locate the balance div within this tile
              const balanceDiv = tile.querySelector('div[data-testid="reward-balance"] .heading-5-v');

              if (balanceDiv) {
                // Extract the balance text and convert it to a number
                const balanceText = balanceDiv.textContent.trim();
                const balanceNumber = parseInt(balanceText.replace(/,/g, ''), 10);

                return balanceNumber;
              }
            }
          }
        }

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
    console.log(`[Amex Content Script] Attempt #${attempts} to parse balance...`);

    const numericBalance = config.parsers.balance();

    if (!isNaN(numericBalance)) {
      console.log(`[Amex Content Script] Balance parsed: ${numericBalance}. Sending to background...`);

      // Send to background script
      chrome.runtime.sendMessage({
        type: "UPDATE_BALANCE",
        programKey: config.programKey,
        newBalance: numericBalance,
        displayName: config.displayName
      }, (response) => {
        console.log("[Amex Content Script] Background responded:", response);
      });

      // Stop polling since we've successfully sent the balance
      clearInterval(intervalId);
    } else {
      console.log("[Amex Content Script] Parsed balance is NaN. Retrying...");
    }

    // If maximum attempts reached, stop polling
    if (attempts >= MAX_ATTEMPTS) {
      console.log("[Amex Content Script] Maximum attempts reached. Giving up on scraping balance.");
      clearInterval(intervalId);
    }
  }, INTERVAL_MS);
})();
