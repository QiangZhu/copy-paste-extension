function dispatch(msg, sender, sendResponse) {
    switch (msg.action) {
        case 'copy':
            copy(msg, sendResponse);
            break;
        case 'paste':
            paste(msg, sendResponse);
            break;
    }
}


function copy(msg, sendResponse) {
    var state = {};

    for (var key in msg.selectors) {
        var selectors = msg.selectors && msg.selectors[key] && msg.selectors[key].selectors;

        selectors.forEach(function(selector) {
            var el = document.body.querySelector(selector);
            var valueAttribute = msg.selectors[key]['value-attribute'] || DEFAULT_VALUE_ATTR;
            var value = el[valueAttribute];

            if (value) {
                state[key] = value.trim(); 
                return;
            }
        });
    }

    sendResponse(state);
}


function paste(msg, sendResponse) {
    for (var key in msg.state) {
        var selectors = msg.selectors && msg.selectors[key] && msg.selectors[key].selectors;
        if (!selectors) {
            break;
        }
        selectors.forEach(function(selector) {
            var el = document.body.querySelector(selector);
            var valueAttribute = msg.selectors[key]['value-attribute'] || DEFAULT_VALUE_ATTR;
            var value = msg.state[key];

            el[valueAttribute] = msg.state[key];
        });
    }

    var emptyState = {};
    sendResponse(emptyState);  // reset state
}


chrome.runtime.onMessage.addListener(dispatch);
