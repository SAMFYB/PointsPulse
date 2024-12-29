// This runs in the context of an AA page, scrapes the balance, sends a message.
(function() {
  const balanceElem = document.querySelector("#balance-amount");
  if (!balanceElem) return;

  const rawBalance = balanceElem.textContent.trim();
  const numericBalance = parseInt(rawBalance.replace(/,/g, ""), 10);
  if (isNaN(numericBalance)) return;

  // Send to background script
  chrome.runtime.sendMessage({
    type: "UPDATE_BALANCE",
    programKey: "americanAirlines",
    newBalance: numericBalance,
    displayName: "American Airlines"
  }, (response) => {
    // Optional callback if needed
    console.log("Background responded:", response);
  });
})();
