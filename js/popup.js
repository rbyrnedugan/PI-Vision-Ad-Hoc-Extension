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

    // handle changes to events
    document.getElementById('newTab').addEventListener('change', updateOptionNewTab);
});

// Saves options to chrome.storage
function updateOptionNewTab() {
    chrome.storage.sync.set({
        newTab: this.checked
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