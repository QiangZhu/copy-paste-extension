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
    console.log('copy');

    var spans = document.body.getElementsByTagName('span');
    msg.userInfo = {};

    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      var val = span.getAttribute('editable-text');

      switch (val) {
        case 'user.firstName':
          msg.userInfo.firstName = span.textContent.trim();
          break;
        case 'user.lastName':
          msg.userInfo.lastName = span.textContent.trim();
          break;
      }
    }

    sendResponse(msg);
}


function paste(msg, sendResponse) {
    sendResponse(msg);
}


chrome.runtime.onMessage.addListener(dispatch);
console.log('workflow-agent active');
