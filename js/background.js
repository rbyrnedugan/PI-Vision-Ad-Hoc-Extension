//    Copyright 2018 OSIsoft, LLC
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

// string to hold the list of symbols to substitute into the URL
var symbols;
// options object
var options;

// Set up defaults on installation
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        newTab: true,
    }, function () {
        console.log("defaults set");
    });
});

// Get options on load
chrome.storage.sync.get({
    newTab: true
}, function (items) {
    options = items;
});

// Update options when they are changed
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        if (namespace == "sync") {
            options[key] = changes[key].newValue;
        }
    }
});

// Event listener to get symbol names from content script when the "Ad Hoc Display" button is pressed
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // First, validate the message's structure
    if ((msg.from === 'adHoc') && (msg.subject === 'symbols')) {
        // Save the symbols to the local variable
        symbols = msg.symbols
        sendResponse({ saved: true })
    }
});

// Intercept the "Ad Hoc Display" button url and redirect to our 
chrome.webRequest.onBeforeRequest.addListener(
    function (details, sender) {
        var targetUrl = details.url
        var newTab = false;

        // Check if the web request url is for the ad-hoc display, and make sure that we have symbols
        if (details.url.includes("AdHocDisplay1?openAdHocDisplay=all") && symbols) {
            console.debug("AdHocDisplay")
            // Create a new URL.  Use parameters:
            //   -openadhocdisplay=<ID1>,<ID2>,...  (This is the list of symbols to trend from the PB Display.  This will need to be passed from the content script.  CSS selector for available IDs:'g[data-canAdHoc="true"]' )
            //   -symbol=trend;MultipleScales=false (This is to create a trend with one scale instead of a table)

            targetUrl = details.url.replace("openAdHocDisplay=all", "openAdHocDisplay=" + symbols) + "&symbol=trend;MultipleScales=false"
            
            // check if the page should be opened in a new tab
            newTab = options.newTab;
        }

        // if set, open the content in a new tab and make no changes to the current tab
        if (newTab) {
            // create a URL variable for creating the tab and then set the targetURL so that it will cancel the request silently on the main page
            var newTabUrl = targetUrl;
            var currentTabId = details.tabId
            targetUrl = "javascript:";

            // Open the URL in a new tab next to the current tab
            chrome.tabs.query({
                active: true, currentWindow: true
            }, tabs => {
                chrome.tabs.create({
                    url: newTabUrl,
                    index: tabs[0].index + 1,
                    openerTabId: currentTabId
                });

            });
        }

        // redirect the URL
        return { redirectUrl: targetUrl };
    },
    {
        urls: [
            "*://*/PIVision/*" //Cannot be more specific here, because the ad-hoc button has href="#"
        ],
        types: ["main_frame"]
    },
    ["blocking"]
);


