// popup.js

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("open-dashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
  });
});
