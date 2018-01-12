console.log("In background.js");
//alert("reloaded");
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //alert("onMessage request = " + request);
        if (request.print) {
            console.log(request, sender);
            chrome.tabs.query({active: true}, function (tabs) {
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
    var msg = msg.replace(/[']/g, '"');
    chrome.tabs.executeScript(tab.id, {
        code: "console.log('" + msg + "')"
    });
}

function printTab(tab) {
    console.log("start printing " + tab.url);
    log(tab, "start printing...");
    chrome.tabs.captureVisibleTab(null, {
        format: 'png'
    }, function (data) {
        chrome.tabs.executeScript(tab.id, {'file': 'sizes.js'},
            function (results) {
                let sizes = JSON.parse(results[0]);
                cropImage(data, {x: x, y: y, w: w, h: h}, function (croppedData) {
                    printDone(tab, croppedData)
                })
            })
    });
}

function cropImage(data, sizes, callback) {
    callback(data);
}

function printDone(tab, data) {
    log(tab, "printDone");
    log(tab, "length = " + data.length);
    log(tab, data.substr(0, 100));
    chrome.tabs.create({
        url: 'http://localhost:9005/results.html'
    }, function (resultTab) {
        log(resultTab, "going to pupulate image");
        chrome.tabs.executeScript(resultTab.id,
            {
                'code': 'var elem = document.getElementById("img-main") ; console.log(elem); elem.src="' + data + '"'
            });
    })
}




