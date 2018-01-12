console.log("In background.js");
//alert("reloaded");
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //alert("onMessage request = " + request);
        if (request.print) {
            console.log(request, sender);
            chrome.tabs.query({active:true}, function(tabs) {
                console.log("after query tabs = ", tabs);
                if (tabs.length == 1) {
                    printTab(tabs[0]);
                }
            })
            sendResponse({status: 'started'});
        }
        return true;
    });

function log(tab, msg) {
    var msg = msg.replace(/[']/g,'"');
    chrome.tabs.executeScript(tab.id,{
        code: "console.log('" + msg + "')"
    });
}

function printTab(tab) {
    console.log("start printing " + tab.url);
    log(tab, "start printing...");
    chrome.tabs.captureVisibleTab(null, {
        format: 'png'
    }, function(data) {
        printDone(tab, data);
    });
}

function printDone(tab, data) {
    log(tab, "printDone");
    log(tab, "length = " + data.length);
}




