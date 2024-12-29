// background.js

// Runs once when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("My Loyalty extension installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_BALANCE") {
    const { programKey, newBalance, displayName } = message;
    // We call our shared update logic here:
    updateBalance(programKey, newBalance, displayName)
      .then(() => sendResponse({ status: "ok" }))
      .catch(err => sendResponse({ status: "error", error: err }));
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

// Shared logic to store or update data
async function updateBalance(programKey, newBalance, displayName) {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const now = Date.now();

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["programData"], (result) => {
      let programData = result.programData || {};

      if (!programData[programKey]) {
        programData[programKey] = {
          displayName: displayName || programKey,
          history: []
        };
      }
      const historyArr = programData[programKey].history;
      const lastEntry = historyArr[historyArr.length - 1];

      let shouldAppend = false;
      if (!lastEntry) {
        shouldAppend = true; // no previous entries
      } else {
        const timeSinceLast = now - lastEntry.timestamp;
        const balanceChanged = (lastEntry.balance !== newBalance);
        const oldEnough = (timeSinceLast > FIVE_MINUTES);

        if (balanceChanged || oldEnough) {
          shouldAppend = true;
        }
      }

      if (shouldAppend) {
        historyArr.push({ timestamp: now, balance: newBalance });
      }

      chrome.storage.local.set({ programData }, () => {
        console.log(`[updateBalance] Updated ${programKey}: ${newBalance}`);
        resolve();
      });
    });
  });
}
