var state = {};


function dispatch() {
    var msg;

    function shouldCopy(url) {
        var substr = 'tom.lyft.net';
        return url.indexOf(substr) >= 0;
    }

    function shouldPaste(url) {
        var substr = 'lyft.zendesk.com';
        return url.indexOf(substr) >= 0;
    }

    getActiveTab(function(tab) {
        if (shouldCopy(tab.url)) {
            msg = {action: 'copy'};
            sendMessage(msg, copy);
        }
        else if (shouldPaste(tab.url)) {
            console.log('localStorage');
            console.log(state.userInfo);
            msg = {action: 'paste', userInfo: state.userInfo};
            sendMessage(msg, paste);
        }
    });
}


function sendMessage(msg, callback) {
    getActiveTab(function(tab) {
        chrome.tabs.sendMessage(tab.id, msg, callback);
    });
}


function getActiveTab(callback) {    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        callback(tabs[0]);
    });
}


function copy(msg) {
    state.userInfo = msg.userInfo;
    console.log('copy success');
}


function paste() {
    console.log('paste success');
}


chrome.browserAction.onClicked.addListener(dispatch);
console.log('tom-agent-helper active');
