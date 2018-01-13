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
                        url: "http://localhost:9000/explore2/extension-results/",
                        active: false,
                    }, function (resultTab) {
                        chrome.tabs.onUpdated.addListener(function (tabId , info) {
                          if (tabId == resultTab.id && info.status === 'complete') {
                              printMap(activeTab, resultTab, function () {
                                  printResearch(activeTab, resultTab)
                              })
                          }
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
        printScreenshot("map", tab, resultTab, rect, callback);
    });
}

function printScreenshot(title, tab, resultTab, rect, callback) {
    window.setTimeout(function() {
        chrome.tabs.captureVisibleTab(null, {
            format: 'png'
        }, function (data) {
            addImage(title, resultTab, data, rect, callback);
        });
    }, 100);
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
            printScreenshot("research field " + liIndex, tab, resultTab, rect, function() {
                printLi(tab, resultTab, liIndex + 1, lisCount);
            });
        });
    } else {
        chrome.tabs.sendMessage(tab.id, {'command': 'show_li','index': -1});
    }
}

function addImage(title, resultTab, data, rect, callback) {
    console.log("In addImage title = " + title);
    chrome.tabs.sendMessage(resultTab.id, {
        command: 'add_image',
        data: data,
        rect: rect,
        title: title,
    }, callback);
}



