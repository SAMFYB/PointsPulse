// This runs in the context of an Delta page, scrapes the balance, sends a message.
(function() {
  const config = {
    programKey: "deltaAirlines",
    displayName: "Delta Airlines",
    selectors: {
      balance: ''
    }
  };

  const balanceElem = document.querySelector(config.selectors.balance);
  if (!balanceElem) return;

  const rawBalance = balanceElem.textContent.trim();
  const numericBalance = parseInt(rawBalance.replace(/,/g, ""), 10);
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
