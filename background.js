chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({file: "highlighter.js"});
    chrome.tabs.executeScript({code: "doAction(true)"});
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == "highlight-code") {
        chrome.tabs.executeScript({file: "highlighter.js"});
        chrome.tabs.executeScript({code: "doAction(true)"});
    }
    else if (command == "un-highlight-code") {
        chrome.tabs.executeScript({file: "highlighter.js"})
        chrome.tabs.executeScript({code: "doAction(false)"});
    }
});
