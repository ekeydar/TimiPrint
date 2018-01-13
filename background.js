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
                    let activeTab = tabs[0];
                    chrome.tabs.create({
                        url: 'http://localhost:9005/results.html',
                        active: false,
                    }, function (resultTab) {
                        printMap(activeTab, resultTab, function() {
                            printResearch(activeTab, resultTab)
                        });
                    });
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

function printMap(tab, resultTab, callback) {
    chrome.tabs.sendMessage(tab.id, {'command': 'map_rect'}, function (resp) {
        let rect = {
            x: resp.x,
            y: resp.y,
            w: resp.width,
            h: resp.height
        };
        cropScreenshot(tab, resultTab, rect, callback);
    });
}

function cropScreenshot(tab, resultTab, rect, callback) {
    chrome.tabs.captureVisibleTab(null, {
        format: 'png'
    }, function (data) {
        addImage(resultTab, data, rect, callback);
    });
}

function printResearch(tab, resultTab) {
    log(tab,"print research starts");

    chrome.tabs.sendMessage(tab.id, {'command': 'lis_count'}, function (resp) {
        let lisCount = resp;
        printLi(tab, resultTab, 0, lisCount);
    });
}

function printLi(tab, resultTab, liIndex, lisCount) {
    log(tab, "in printLi liIndex = " + liIndex + " lisCount = " + lisCount);
    if (liIndex < lisCount) {
        chrome.tabs.sendMessage(tab.id, {'command': 'show_li','index': liIndex}, function (resp) {
            let rect = {
                x: resp.x,
                y: resp.y,
                w: resp.width,
                h: resp.height
            };
            cropScreenshot(tab, resultTab, rect, function() {
                printLi(tab, resultTab, liIndex + 1, lisCount);
            });
        });
    }
}

function addImage(resultTab, data, rect, callback) {
    log(resultTab, "printDone");
    log(resultTab, "length = " + data.length);
    cropImage(data, rect, function (cropUrl) {
        chrome.tabs.executeScript(resultTab.id, {
            'code': 'var elem = document.createElement("img") ; elem.src="' + cropUrl + '";' +
                'document.getElementById("results").appendChild(elem);'
        }, function() {
            callback();
        });
    });
}


function cropImage(dataUrl, rect, callback) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = rect.w;
    canvas.height = rect.h;
    img = document.createElement("img");
    img.src = dataUrl;
    img.onload = function () {
        ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
        callback(canvas.toDataURL());
    };
}



