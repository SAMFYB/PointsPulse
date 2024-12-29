// background.js

// Runs once when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Background] My Loyalty extension installed or updated.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Background] Received message:", message, "from sender:", sender);

  if (message.type === "UPDATE_BALANCE") {
    const { programKey, newBalance, displayName } = message;
    console.log(`[Background] UPDATE_BALANCE for programKey="${programKey}" with newBalance=${newBalance}.`);

    updateBalance(programKey, newBalance, displayName)
      .then(() => {
        console.log(`[Background] updateBalance completed successfully for "${programKey}".`);
        sendResponse({ status: "ok" })
      })
      .catch(err => {
        console.error("[Background] updateBalance encountered an error:", err);
        sendResponse({ status: "error", error: err })
      });

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
        console.log(`[Background] No existing data for "${programKey}". Initializing new entry.`);
        programData[programKey] = {
          displayName: displayName || programKey,
          history: []
        };
      }
      const historyArr = programData[programKey].history;
      const lastEntry = historyArr[historyArr.length - 1];
      console.log(`[Background] Last entry for "${programKey}":`, lastEntry);

      let shouldAppend = false;
      if (!lastEntry) {
        console.log("[Background] No last entry found—will append new data.");
        shouldAppend = true; // no previous entries
      } else {
        const timeSinceLast = now - lastEntry.timestamp;
        const balanceChanged = (lastEntry.balance !== newBalance);
        const oldEnough = (timeSinceLast > FIVE_MINUTES);

        console.log(`[Background] Time since last entry: ${timeSinceLast}ms.`);
        console.log(`[Background] balanceChanged=${balanceChanged}, oldEnough=${oldEnough}`);

        if (balanceChanged || oldEnough) {
          shouldAppend = true;
        }
      }

      if (shouldAppend) {
        historyArr.push({ timestamp: now, balance: newBalance });
        console.log(`[Background] Appended new entry: balance=${newBalance}, timestamp=${now}`);
      } else {
        console.log("[Background] No new entry appended (not changed or not old enough).");
      }

      chrome.storage.local.set({ programData }, () => {
        console.log(`[updateBalance] Updated ${programKey}: ${newBalance}`);
        resolve();
      });
    });
  });
}
