var state = {};


/**
 * Action when navbar button is clicked.
 * @param callback fn
 */
function onBrowserAction() {
    function getSiteFromSchema(url, schema) {
        for (var site in schema.sites) {
            var regexString = schema.sites[site]['url-regex'];
            var regex = new RegExp(regexString);
            if (regex.test(url)) {
                return schema.sites[site];
            }
        }
    }

    function getActionString(siteSchema) {
        var stateIsEmpty = !state || !Object.keys(state).length;
        if (stateIsEmpty && siteSchema.copy) {
            return 'copy';
        } else if (!stateIsEmpty && siteSchema.paste) {
            return 'paste';
        }
    }

    function updateState(newState) {
        state = newState;
        console.log('copy agent state updated');
        console.log(state);
    }

    loadSchema(function(err, schema) {
        if (err) {
            // TODO
            return;
        }
        getActiveTab(function(tab) {
            var siteSchema = getSiteFromSchema(tab.url, schema);
            if (!siteSchema) {
                return;
            }
            var action = getActionString(siteSchema);
            var msg = {
                action: action,
                selectors: siteSchema[action],
                state: state,
            };

            sendMessage(msg, updateState);
        });
    });
}


/**
 * Broadcast to listeners on content script.
 * @param msg any
 * @param callback fn
 */
function sendMessage(msg, callback) {
    getActiveTab(function(tab) {
        chrome.tabs.sendMessage(tab.id, msg, callback);
    });
}


/**
 * Load copy schema from storage.sync.
 * @param callback fn
 */
function loadSchema(callback) {
    function onComplete(data) {
        var err = chrome.runtime.lastError;
        var dataIsEmpty = !data || !Object.keys(data).length;

        if (err || dataIsEmpty) {
            delete chrome.runtime.lastError;
            callback(err || 'no data!');
            return;
        }

        var schema = data['copy-agent-schema'];
        callback(null, schema);
    }

    chrome.storage.sync.get('copy-agent-schema', onComplete);
}


/**
 * Return a Tab object with data for the active tab.
 * @param callback fn
 */
function getActiveTab(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        callback(tabs[0]);
    });
}


chrome.browserAction.onClicked.addListener(onBrowserAction);
