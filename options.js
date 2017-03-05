var defaultSchema = {
    "schema-version": 1,
    "author": "example",
    "description": "example",
    "sites": {
        "github": {
            "url-regex": "https?:\/\/github.com\/*",
            "copy": {
                "title": {
                    "selectors": [".js-issue-title"],
                    "value-attribute": "textContent"
                }
            },
            "paste": {
                "title": {
                    "selectors": ["#new_comment_field"],
                    "value-attribute": "value"
                }
            }
        }
    }
};


/**
 * Read schema from options menu and persist to storage.sync.
 */
function save() {
	var schemaRaw = document.getElementById('copy-agent-schema').value;
    var schema = JSON.parse(schemaRaw);

    // callback on after sync.set
    function onComplete() {
        var err = chrome.runtime.lastError;
        var status = document.getElementById('status');

        status.textContent = err || 'Options saved.';
        delete chrome.runtime.lastError;

        setTimeout(function() {
            status.textContent = '';
        }, 2000);
    }

    chrome.storage.sync.set({'copy-agent-schema': schema}, onComplete);
}


/**
 * Read schema from storage.sync and write to options menu.
 */
function restore() {
    // callback on after sync.get
    function onComplete(data) {
        var err = chrome.runtime.lastError;
        var schemaString = err || JSON.stringify(data['copy-agent-schema'], null, 2);

        delete chrome.runtime.lastError;
		document.getElementById('copy-agent-schema').value = schemaString;
    }

    chrome.storage.sync.get({'copy-agent-schema': defaultSchema}, onComplete);
}


document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
