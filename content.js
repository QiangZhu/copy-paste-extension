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

            var valueAttribute = msg.selectors[key]['value-attribute'] || 'textContent';
            var value = el[valueAttribute];

            var startChar = msg.selectors[key]['start-char'] || 0;
            var endChar = msg.selectors[key]['end-char'] || undefined;

            if (value) {
                state[key] = value.trim().slice(startChar, endChar);
                return;
            }
        });
    }

    console.log('copy agent state updated');
    console.log(state);
    sendResponse(state);
}


function paste(msg, sendResponse) {
    for (var key in msg.state) {
        var selectors = msg.selectors && msg.selectors[key] && msg.selectors[key].selectors;
        if (!selectors) {
            break;
        }
        selectors.forEach(function(selector) {
            var elements = document.body.querySelector(selector);
            var valueAttribute = msg.selectors[key]['value-attribute'] || 'value';
            var value = msg.state[key];

            el[valueAttribute] = msg.state[key];
        });
    }

    var emptyState = {};
    sendResponse(emptyState);  // reset state
}


chrome.runtime.onMessage.addListener(dispatch);
