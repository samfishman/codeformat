chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({file: "highlighter.js"});
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == "highlight-code") {
        chrome.tabs.executeScript({file: "highlighter.js"});
    }
});
