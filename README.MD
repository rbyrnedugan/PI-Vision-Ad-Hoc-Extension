# <Your repository name here>

## About

This project is a Google Chrome extension that adds functionality for creating ad-hoc trends from multiple data items when viewing imported PI ProcessBook® displays in PI Vision™.  

When viewing an imported PI ProcessBook® display, it is now possible to multi-select data items (using Ctrl+Click or Shift+Click) and then create an ad-hoc trend from those data items using the button in the top bar.

![Extension Demo](/help/screenDemo.gif)

This extension is targeted at PI Vision™ 2017 R2 (3.3.x) and earlier. PI Vision™ 2019 will have similar funcionality built in.

This extension is still in beta.

## Removing the screen flash (unoffical workaround)

When using the Ctrl+Click or Shift+Click on a display, PI Vision™ will still try to launch the standard overlay trend display, and the extension will immediately close it.  This will cause a quick flash on the screen as the trend is loaded and then closed.  This can be resolved by modifying the code for the click event listener in PI Vision.  

> Note: This is an unofficial workaround and will need to be repeated after upgrading PI Vision.  Line numbers listed are for PI Vision™ 2017 R2, but may be different in other versions.

The following modification to the file will not show the trend popup if Ctrl or Shift are pressed:

File: `%pihome64%\PIVision\Scripts\app\pbviewer\pbviewer.display.viewmodel.js`

Original (lines 638 - 642)
```javascript
$('#' + symbolNameSelector)
    .click(function () {
        that.selectedSymbol = symbolName;
        that.toggleMode();
    });
```
Modified
```javascript
$('#' + symbolNameSelector)
    .click(function (e) {
        if (!(e.shiftKey || e.ctrlKey)) {
            that.selectedSymbol = symbolName;
            that.toggleMode();
        }
    });
```

## Contributing

<Please explain here how you expect receiving contributions>

We do welcome everyone to contribute and be certain all contributions will be considered. Please make sure that you read our general [contribution guidelines][1] and agree with it; it also contains a lot if useful information. Please keep in mind that integrating your contribution may require some adjustments in your code, if this is the case this can be discussed in the Pull Request you submit.

## Licensing

Copyright 2018 OSIsoft, LLC.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
Please see the file named [LICENSE](LICENSE).

<div>Icons made by <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
Icons were modified by OSIsoft


[1]: https://github.com/osisoft/contributing