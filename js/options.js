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

document.addEventListener('DOMContentLoaded', function () {
    // load options from storage
    restoreOptions();

    // save options on button press
    document.getElementById('save').addEventListener('click', saveOptions);});


// Saves options to chrome.storage
function saveOptions() {
    var newTab = document.getElementById('newTab').checked;
    chrome.storage.sync.set({
        newTab: newTab
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    // Use default value newTab = true.
    chrome.storage.sync.get({
        newTab: true
    }, function (items) {
        document.getElementById('newTab').checked = items.newTab;
    });
}
