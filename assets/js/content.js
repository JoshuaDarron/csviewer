// Content script to intercept CSV files
(function() {
  'use strict';
  
  // Check if the current page is a CSV file
  if (window.location.pathname.toLowerCase().endsWith('.csv') || 
      document.contentType === 'text/csv' ||
      document.contentType === 'application/csv') {
    
    // Prevent the default CSV display and redirect to our viewer
    const csvUrl = window.location.href;
    const viewerUrl = chrome.runtime.getURL('viewer.html') + '?url=' + encodeURIComponent(csvUrl);
    
    // Replace current page with our viewer
    window.location.replace(viewerUrl);
  }
})();
