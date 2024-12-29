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
        console.log("[AA Content Script] Raw balance text:", rawBalance);
        const numericBalance = parseInt(rawBalance.replace(/[^0-9]/g, ""), 10);
        console.log("[AA Content Script] Parsed numeric balance:", numericBalance);
        return numericBalance;
      }
    }
  };

  const balanceElem = document.querySelector(config.selectors.balance);
  if (!balanceElem) {
    console.log("[AA Content Script] Balance element not found. Exiting.");
    return;
  }

  if (isNaN(numericBalance)) {
    console.log("[AA Content Script] Numeric balance is NaN. Exiting.");
    return;
  }

  // Send to background script
  chrome.runtime.sendMessage({
    type: "UPDATE_BALANCE",
    programKey: config.programKey,
    newBalance: numericBalance,
    displayName: config.displayName
  }, (response) => {
    console.log("[AA Content Script] Background responded:", response);
  });
})();
