["main.js","2015-08-21T20:15:34.938Z","3FR8YVX/8hWY3R4uro8wNheTupx1ekB0xdy0KHmtTK9QN90UiMFXj7XpqjhQShzXiObisk80HC8+yg5UZC0Pm0GGgZv8c6wwL+mhDii8jF3NAF38SQ3swZv+VBrs3ryI"]
;(function main() {
  'use strict';
  // THIS IS THE WORK IN PROGRESS VERSION
  // It shows the following features
  // * Code signing
  // * Module organization
  // * Loader API usage

  // ### Shared module
  // Define functions used by the Service Worker and the Standalone Client
  // like IndexedDB operations and cryptographic handling.
  function sharedModule() {
    'use strict'; // *will be* injected in the generated page
    let exports = {};
    // Work in progress
    
    return exports;
  }

  // ### Standalone Client Module
  // Define functions like DOM manipulation and user interaction
  function clientModule(sharedModule) {
    'use strict'; // *will be* injected in the generated page
    // Work in progress
  }

  // ### Service Worker specific data:
  // Initialize the shared module for worker usage:
  const shared = sharedModule();

  // Export render function to be used in the loader:
  self['serviceWorkerRender'] = function (url) {
    return Promise.resolve(generateResponse({}));
  };

  function generateResponse(data) {
    // Create a new response like the recipe says:
    return new Response(new Blob([
      // Reuse the header from the loader:
      GENERIC_HEADER +
      // Reuse error styles for WIP response:
      ERROR_STYLES +
      // WIP content:
      '<style>html{text-align:center;background:#03A9F4}</style><h1>wshp needs content</h1><p>We still don\'t have content to show. For more info <a href="https://github.com/qgustavor/wshp.tk">check our GitHub page</a>.'
    ], {type: 'text/html; charset=UTF-8'}));
  }
}());
