// Background script for CSV Editor extension

chrome.action.onClicked.addListener((tab) => {
  // Open CSV viewer in a new tab when extension icon is clicked
  chrome.tabs.create({
    url: chrome.runtime.getURL('viewer.html')
  });
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CSV Editor extension installed');
});
