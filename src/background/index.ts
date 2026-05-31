/**
 * Background Service Worker
 * Manifest V3 background script entry point
 */

console.log('DevGrid background service worker initialized');

// Service worker lifecycle
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Extension started');
});

// Message listener for communication with content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message);
  sendResponse({ received: true });
  return true;
});
