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

// This script handles selecting symbols and passing the symbol list to the the background script 
// so that it can be used in the URL redirction
var options;

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


$(document).ready(function () {
    // console.log("Content Loaded: Document Ready");
    // wait until the PB display svg is rendered, and then add events
    waitForElem('#pbdisplay > svg', addEvents);
});


var addEvents = function () {
    // Update click events for symbols
    $.each($('g[data-canAdHoc="true"]'), function (i, elem) {
        addSymbolSelectEvent(elem);
    })

    // Update click for "Ad Hoc Display" button
    addAdHocClickEvent();

    // Deseelect all if you click away
    addDeselectAll();
}

// add a click event to toggle selection on shift+click or ctrl+click
var addSymbolSelectEvent = function (elem) {
    // Create a new handler that allows for custom ctrl+click and shift+click options
    $(elem).click(function (e) {
        // if shift or ctrl are held, then treat it as a multi-select
        if (e.shiftKey || e.ctrlKey) {
            // toggle the class to show it as selected
            $(this).toggleClass('adHocSelected');
            changeAdHocName();

            // close the trend popup.  This is not ideal (better never to have the popup open in the first place) but is better than nothing.
            // it may be possible to modify the default event on the PI Vision server to stop processing if ctrl or shift modifiers are present.
            /*
             * the trend popup can be blocked by modifying the event handler in Vision so that it only fires when Ctrl or Shift are not pressed
             * File: "%pihome64%\PIVision\Scripts\app\pbviewer\pbviewer.display.viewmodel.js"
             * Lines: 638 - 642
             * Original:
                    $('#' + symbolNameSelector)
                        .click(function () {
                            that.selectedSymbol = symbolName;
                            that.toggleMode();
                        });
             * Updated:
                    $('#' + symbolNameSelector)
                        .click(function (e) {
                            if (!(e.shiftKey || e.ctrlKey)) {
                                that.selectedSymbol = symbolName;
                                that.toggleMode();
                            }
                        });

            */
            closePopUpTrend();
        }
        else {
            // // otherwise, use the standard click event handler
            // oldClick(e);
        }
    })
    // console.log($._data(elem, 'events'));
}

// add a click event for the "Ad Hoc Display" button that sends the list of selected symbols to the background script
var addAdHocClickEvent = function () {
    $('#toolbar-itemAdHocButton > a').click(function (e) {
        // send the symbols list to the background script
        chrome.runtime.sendMessage({
            from: 'adHoc',
            subject: 'symbols',
            symbols: $('.adHocSelected').map(function (i, elem) { return elem.id }).get().join()
        },
            // response added to make the call synchronous, in an attempt to delay the page redirection 
            // to avoid a race condition where the background page tries to redirect using old symbols.
            // There's probably a better way to accomplish this 
            function (response) {
                console.log(response);
            }
        );

        // deselect all if not opening in a new tab
        if (!options.newTab) {
            deselectAll()
        }
    });
}

// deselect all when a non-selectable item in the display is clicked
var addDeselectAll = function () {
    $('#pbdisplay > svg').click(
        function (e) {
            // deselect all if the following are not true:
            //   * the click is on a descendent of a can-adhoc element
            //   * ctrl or shift are held
            if (!($(e.target).closest('g[data-canAdHoc="true"]')[0] || e.shiftKey || e.ctrlKey)) {
                deselectAll()
            }
        }
    );
}

var deselectAll = function () {
    $('.adHocSelected').toggleClass('adHocSelected');
    changeAdHocName();
}


// close the pop-up trend
var closePopUpTrend = function () {
    // wait for the trend close button to exist (up to 1 sec)
    waitForElem('#popupTrendCloseButton', function() {
        try{
            $('#popupTrendCloseButton')[0].dispatchEvent(new MouseEvent("click"));
        } 
        catch (err) {
            // disregard TypeError if popup doesn't load
            if (err.name != "TypeError") {
                console.error(err);
            }  
        }
    }, 
    10);
}

var changeAdHocName = function () {
    // if no items are selected, use default name
    if ($('.adHocSelected').length == 0) {
        $('#toolbar-itemAdHocButton > a > div > span').text('Ad Hoc Display')
        $('#toolbar-itemAdHocButton > a > div').removeClass('customAdHoc')
        $('#toolbar-itemAdHocButton > a').attr('title', 'Create an Ad Hoc display from visible symbols')
    }
    // if items are selected, update adhoc button text
    else {
        $('#toolbar-itemAdHocButton > a > div > span').text('Ad Hoc Selected')
        $('#toolbar-itemAdHocButton > a > div').addClass('customAdHoc')
        $('#toolbar-itemAdHocButton > a').attr('title', 'Create an Ad Hoc display from selected symbols')
    }
}

/**
 * Wait for the specified element to appear in the DOM. When the element appears,
 * provide it to the callback.
 *
 * @param selector a jQuery selector (eg, 'div.container img')
 * @param callback function that takes selected element (null if timeout)
 * @param maxtries number of times to try (return null after maxtries, false to disable, if 0 will still try once)
 * @param interval ms wait between each try
 */
var waitForElem = function (selector, callback, maxtries = false, interval = 100) {
    const poller = setInterval(() => {
        const el = jQuery(selector);
        const retry = maxtries === false || maxtries-- > 0
        if (retry && el.length < 1) return // will try again
        clearInterval(poller);
        callback(el || null);
    }, interval);
}
