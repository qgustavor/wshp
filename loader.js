/*
 *   The Signed File Loader That Prevents Itself From Updating
 *                  -- take that other signed file loaders
 */
'use strict';

// Debug mode requires to use a self-signed certificate
// (because no CA will sign a certificate for a impossible domain)
// You can use any static web server for testing it

// Reason: make difficult for a average user to enable it
// Effects: skips signature checking and enable auto-reloading
// The chosen name is to warn the user even if the certificate is trusted
const DEBUG_MODE = location.origin === 'https://unsafe-website.do-not-trust:8000';

// Hard coded variables:
const FILENAME = 'main.js';
const WEBSITE_NAME = 'wshp'; /* maybe needs localization */

const CHECK_PROBLEMS_SNIPPET = '<script>(' + handleProblems + '())</script>';
const GENERIC_HEADER = `<!DOCTYPE html>
<html lang=pt>
<meta charset=utf-8>
<meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width">
<title>${WEBSITE_NAME}</title>
${CHECK_PROBLEMS_SNIPPET}`;

// Based on Google error pages:
const ERROR_STYLES = `<style>
  *{margin:0;padding:0}
  html{font:15px/22px sans-serif;background:#FF9800;color:#222;padding:15px}
  body{background:#FFF;margin:7% auto 0;max-width:500px;padding:30px;border-radius:3px}
  p{margin:11px 0 22px}
  strong{color:#111}
</style>`;

/* needs localization start */
const HOW_TO_FIX = ' make sure your computer, browser and connection are working properly and that proxies are not being used (which are not supported). If this application has to be used on a network that requires proxies download the offline version.<p>Also consider the site to be in trouble: open the page in incognito window and if the website has been compromised look for additional instructions on social networks.<p>You can look for the website name, official accounts or use this generated hashtag #hb' + (Date.now() / 7e7 | 0).toString(36);

const SCRIPT_FAIL_MESSAGE = GENERIC_HEADER + ERROR_STYLES + '<h1>Sorry!</h1><p>Unless that was the alpha version this error should never have happened. Look for help and if the problem persists clean the cache, which is insecure but sadly is the only thing that can be done.';

const SOFT_FAIL_MESSAGE = GENERIC_HEADER + ERROR_STYLES  + '<h1>Error loading the page</h1><p>This <strong>may have been caused</strong> for the cleaning of cookies, either manually or automatically. <p>If you suspect that this is not the problem' + HOW_TO_FIX;

const HARD_FAIL_MESSAGE = GENERIC_HEADER + ERROR_STYLES  + '<style>html{background:#8B0920}</style><h1>Segurity failue</h1><p>Maybe <strong>some extension or proxy</strong> tried to change this website local database.<p>Is recommended to' + HOW_TO_FIX;
/* needs localization end */

const STATES_ENUM = {
  LOADING: 0,
  SCRIPT_LOADED: 1,
  SOFT_FAIL: 2,
  HARD_FAIL: 3,
  SCRIPT_FAIL: 4
};

const PUBLIC_KEY_PROMISE = crypto.subtle.importKey(
  'jwk',
  {'crv':'P-384', 'ext':true, 'key_ops':['verify'], 'kty':'EC',
   'x':'mS7T5I0Y-sSY7_YsZKcRtUkrJTZSbQEsbpBGy2m6x5i_5JeJgoV3ScDjBAkXoMqU',
   'y':'BNomK-S3TeKBLjcg1TfFqPzQUubobfU2HD0aEcZW_AxHvQ-CW2Cvghqr0WUDU9n6'},
  { name: 'ECDSA', namedCurve: 'P-384' },
  false,
  ['verify']
);

// Initialize variables:
let state, pendingPromises, cachedScript, cachedMetadata;
resetState();

// Reset state (on init and generally after a time out)
function resetState() {
  state = STATES_ENUM.LOADING;
  pendingPromises = [];
  cachedScript = '';
}

// Load cached script from IndexedDB:
let dbRequest = indexedDB.open('hb-binary', 1);
dbRequest.onsuccess = function (evt){
  let db = evt.target.result;
  if (!db.objectStoreNames.contains('binary')) {
    dbRequest.onerror();
    return;
  }
  let request = db.transaction('binary').objectStore('binary').get(FILENAME);
  request.onerror = dbRequest.onerror;
  request.onsuccess = function(event) {
    let result = event.target.result;
    if (!result) {
      dbRequest.onerror();
      return;
    }
    checkValidity(result['contents']).then(function(isValid) {
      state = isValid ? STATES_ENUM.SCRIPT_LOADED : STATES_ENUM.HARD_FAIL;

      if (isValid) {
        runCode(result['contents']);
        
        // Do auto-update at least every week:
        // Also update when it was checked on the future
        // because some of our users can be time travellers
        let lastChecked = new Date(result['downloadedTime']).getTime();
        if (lastChecked + 6048e5 < Date.now() || lastChecked > Date.now()) {
          fetchViaHttp(result['updatedTime']);
        }
      }

      handleCallbacks();
    });
  };
};

// Handle cases where the DB version was changed or if it`s not created:
dbRequest.onerror = dbRequest.onupgradeneeded = function () {
  // Disable success handler:
  dbRequest.onsuccess = null;
  fetchViaHttp();
};

/* Helper function used for converting UTF-8 to Uint8Array */
function decodeUTF8(s) {
  var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++) {b[i] = d.charCodeAt(i);}
  return b;
}

/* Helper function used for converting Base64 to Uint8Array */
function decodeBase64(s) {
  var i, d = atob(s), b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
  return b;
}

/* Checks the signature from a signed file */
function checkValidity(result, minModDate) {
  if (DEBUG_MODE) {
    return Promise.resolve(true);
  }

  if (typeof result !== 'string') {
    return Promise.resolve(false);
  }

  return PUBLIC_KEY_PROMISE.then(function (publicKey) {
    let splitedResult = result.split('\n');
    let metadata = splitedResult.shift();
    let data = splitedResult.join('\n');

    // Parse JSON:
    metadata = JSON.parse(metadata);

    // Name, modification date and signature are required, other entries are optional
    // And can be used to store release info, change logs, among other data
    // [name, modification date, ..., signature]

    if (!metadata || !Array.isArray(metadata) || metadata.length < 3) {
      return Promise.resolve(false);
    }

    // Check modification date and file name:
    if (metadata[0] !== FILENAME || metadata[1] <= minModDate) {
      return Promise.resolve(false);
    }

    var signature = metadata.pop();

    return crypto.subtle.verify({
        name: 'ECDSA',
        hash: {name: 'SHA-512'},
      },
      publicKey,
      decodeBase64(signature).buffer,
      decodeUTF8(JSON.stringify(metadata) + '\n' + data).buffer
    ).then(function (isValid) {
      if (isValid) {
        cachedMetadata = metadata;
      }
      return isValid;
    });
  }).catch(function(){
    // Encoding errors and others resolve to false
    return Promise.resolve(false);
  });
}


function fetchViaHttp(minimalVersion) {
  // Fetch new code:
  return fetch(FILENAME).then((response) => {
    if (response.ok) {
      return response.text();
    } else { // file not found
      state = STATES_ENUM.HARD_FAIL;
      handleCallbacks();
    }
  }, () => { // network error
    if (state === STATES_ENUM.LOADING) {
      state = STATES_ENUM.SOFT_FAIL;
      handleCallbacks();
      setTimeout(resetState, 5000);
    }
  }).then((code) => {
    if (state === STATES_ENUM.LOADING || state === STATES_ENUM.SCRIPT_LOADED) {
      checkValidity(code).then(function (isValid) {
        if (isValid) {
          // Replace any existent database:
          var request = indexedDB.deleteDatabase('hb-binary');

          // Store script and run it:
          runCode(code);

          // Deleting or not save code:
          request.onerror = request.onsuccess = saveCodeInDatabase;
        }

        if (state === STATES_ENUM.LOADING) {
          state = isValid ? STATES_ENUM.SCRIPT_LOADED : STATES_ENUM.HARD_FAIL;
          handleCallbacks();
        }
      });
    }
  });
}

function saveCodeInDatabase () {
  var request = indexedDB.open('hb-binary', 1);

  request.onupgradeneeded = function(e) {
    var store = e.target.result.createObjectStore('binary', {keyPath: 'filename'});
    store.createIndex('binary', 'binary', {unique: true});

    // downloadedTime needs to be updated if it's updated
    // in other way than HTTP (P2P or manually) in order
    // to prevent the automatic weekly update
    store.add({
      'filename': FILENAME,
      'contents': cachedScript,
      'updatedTime': cachedMetadata[1],
      'downloadedTime': new Date().toISOString()
    });
  };
}

function runCode(code) {
  // Even if we just validated the signature...
  // ... IT'S STILL EVIL! (笑)
  try {
    eval(cachedScript = code);
  } catch(e) {
    console.error('[Loader]', e.message);
    state = STATES_ENUM.SCRIPT_FAIL;
  }
}

// Service Worker functions:
self.addEventListener('install', function (event) {
  // Who said Service Workers are just for caching things?
  if (event.respondWith) {
    // Check if window.crypto is defined
    // Currently undefined in Firefox for some reason
    let response = window.crypto ?
      fetchViaHttp() :
      Promise.reject();
      
    event.respondWith(response);
  }
});

self.addEventListener('fetch', function(event) {
  if (DEBUG_MODE) {
    state = STATES_ENUM.LOADING;
    fetchViaHttp();
  }
  event.respondWith(new Promise((resolve) => {
    pendingPromises.push({event, resolve});
    if (state !== STATES_ENUM.LOADING) {
      handleCallbacks();
    }
  }).catch((err) => {
    console.error('[Loader]', err);
    return generateScriptErrorResponse();
  }));
});

function generateScriptErrorResponse() {
  return new Response(new Blob([SCRIPT_FAIL_MESSAGE], {type: 'text/html; charset=UTF-8'}), {
    status: 503,
    statusText: 'Internal Server Error'
  });
}

function handleCallbacks () {
  pendingPromises.forEach(function (promise) {
    if (promise.done) {return;}
    promise.done = true;

    switch (state) {
      case STATES_ENUM.SCRIPT_FAIL:
      promise.resolve(generateScriptErrorResponse());
      break;

      case STATES_ENUM.SOFT_FAIL:
      promise.resolve(new Response(new Blob([SOFT_FAIL_MESSAGE], {type: 'text/html; charset=UTF-8'}), {
        status: 503,
        statusText: 'Service Unavailable'
      }));
      break;

      case STATES_ENUM.SCRIPT_LOADED:
      let url = promise.event.request.url;
      let originalResponse;
      promise.resolve(
        self['serviceWorkerRender'](url)
        .then(data => {
          // Normalize response:
          originalResponse = data instanceof Response ? data : new Response(data);
          return originalResponse.blob();
        }).then(blob => {
          // Build headers object
          let headers = {};
          originalResponse.headers.forEach((value, key) => {
            headers[key] = value;
          });

          // He are working on content-type, so don't sniff data:
          headers['x-content-type-options'] = 'nosniff';

          // Clone response in order to allow headers to be changed:
          let response = new Response(blob, {
            status: originalResponse.status,
            statusText: originalResponse.statusText,
            headers: headers
          });

          return response;
        })
        .catch(function (err) {
          console.error('[Loader]', err);
          return generateScriptErrorResponse();
        })
      );
      break;

      default:
      promise.resolve(promise.resolve(new Response(new Blob([HARD_FAIL_MESSAGE], {type: 'text/html; charset=UTF-8'}), {
        status: 503,
        statusText: 'Service Unavailable'
      })));
    }
  });

  // Some weird way for emptying an array
  // There is a JSPerf which explains it
  while(pendingPromises.length){
    pendingPromises.pop();
  }
}

function handleProblems() {
  'use strict'; // injected in generated page
  navigator.serviceWorker.getRegistration().then(function(worker){
    if (worker.waiting){ problemHappened(); }
    worker.onupdatefound = problemHappened;
    worker.active.onstatechange = problemHappened;
  });

  try {
    ['updatefound', 'controllerchange'].forEach(function(evt){
      navigator.serviceWorker.addEventListener(evt, problemHappened);
      navigator.serviceWorker.controller.addEventListener(evt, problemHappened);
    });
  } catch(e){}

  let alreadyHandled = false;

  function problemHappened(){
    if(alreadyHandled) {return;}
    alreadyHandled = true;

    // Just a simple changing hashtag in order to try avoid censoring:
    let hash = (Date.now() / 7e7 | 0).toString(36);
    let message = '--- Failure in the application security ---\n\nThe unexpected change of the file responsible for security at the site was detected and usually that means the site or even that computer was hacked.\n\nThis warning is being shown in all open tabs, therefore be sure to follow these instructions:\n\n1. DO NOT reload the page, do not force the reload and neither clear the cache.\n2. Look for information about the incident in social networks and search websites.\n3. If you do not find information (because accounts got hacked or censored) use those generated hashtags #hb' + hash + ' and #hb' + (Date.now() / 8e7 | 0).toString(32) + '\n4. Make sure your computer has been hacked looking for viruses, trojans, malicious extensions or malicious proxies using the tools designed for that. If you do not have these tools prefer to look for them on another device.\n5. This error message will keep being displayed while the original security file is active and usually will be automatically disabled when the open tabs are closed.'; /* needs localization */

    setTimeout(function () {
      try {
        if (!localStorage[hash]) {
          alert(message);
          localStorage[hash] = true;
        }
      } catch(e){ alert(message); }
      // Wait a random time to avoid multiple messages at the same time
    }, Math.random() * 4e3);

    (function ensureloop() {
      setTimeout(ensureloop, 10e3);
      document.head.innerHTML = '';
      document.title = 'Error!'; /* needs localization */
      document.body.innerHTML = '<style>html{background:#8B0920}body{background:#FFF;border-radius:3px;font:15px/22px sans-serif;margin:7%;padding:30px;white-space:pre-wrap}</style>' + message;
    }());
  }
}
