// This runs in the context of an Delta page, scrapes the balance, sends a message.
(function() {
  const balanceElem = document.querySelector("#balance-amount");
  if (!balanceElem) return;

  const rawBalance = balanceElem.textContent.trim();
  const numericBalance = parseInt(rawBalance.replace(/,/g, ""), 10);
  if (isNaN(numericBalance)) return;

  // Send to background script
  chrome.runtime.sendMessage({
    type: "UPDATE_BALANCE",
    programKey: "deltaAirlines",
    newBalance: numericBalance,
    displayName: "Delta Airlines"
  }, (response) => {
    // Optional callback if needed
    console.log("Background responded:", response);
  });
})();
