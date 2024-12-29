// This runs in the context of an AA page, scrapes the balance, sends a message.
(function() {
  const config = {
    programKey: "americanAirlines",
    displayName: "American Airlines",
    selectors: {
      balance: 'div[data-testid="award-miles-balance-text"]'
    },
    parsers: {
      balance: (balanceElem) => {
        const rawBalance = balanceElem.textContent.trim();
        const numericBalance = parseInt(rawBalance.replace(/[^0-9]/g, ""), 10);
        return numericBalance;
      }
    }
  };

  const balanceElem = document.querySelector(config.selectors.balance);
  if (!balanceElem) return;

  if (isNaN(numericBalance)) return;

  // Send to background script
  chrome.runtime.sendMessage({
    type: "UPDATE_BALANCE",
    programKey: config.programKey,
    newBalance: numericBalance,
    displayName: config.displayName
  }, (response) => {
    // Optional callback if needed
    console.log("Background responded:", response);
  });
})();
