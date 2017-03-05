var defaultSchema = {
    "schema-version": 1,
    "sites": {
        "github": {
            "url-regex": "http?://github.com/*",
            "get": {
                "title": {
                    "selectors": [".js-issue-title"],
                    "attribute": "textContent"
                }
            },
            "set": {
                "phone": {
                    "selectors": ["#new_comment_field"],
                    "attribute": "textContent"
                }
            }
        }
    }
};


function save() {
	var schemaRaw = document.getElementById('copy-agent-schema').value;
    var schema = JSON.parse(schemaRaw);

    function onComplete() {
        var err = chrome.runtime.lastError;
        var status = document.getElementById('status');

        status.textContent = err || 'Options saved.';
        chrome.runtime.lastError = null;

        setTimeout(function() {
            status.textContent = '';
        }, 2000);
    }

    chrome.storage.sync.set({'copy-agent-schema': schema}, onComplete);
}


function restore() {
    function onComplete(data) {
        console.log('restore complete')
        var err = chrome.runtime.lastError;
        var schemaString = err || JSON.stringify(data['copy-agent-schema'], null, 2);

        chrome.runtime.lastError = null;
		document.getElementById('copy-agent-schema').value = schemaString;
    }

    chrome.storage.sync.get({'copy-agent-schema': defaultSchema}, onComplete);
}


document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
