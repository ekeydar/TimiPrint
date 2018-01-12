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
                    chrome.tabs.create({
                        url: 'http://localhost:9005/results.html',
                        active: false,
                    }, function (resultTab) {
                        printTab(tabs[0], resultTab);
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

function printTab(tab, resultTab) {
    console.log("start printing " + tab.url);
    log(tab, "start printing...");
    chrome.tabs.captureVisibleTab(null, {
        format: 'png'
    }, function (data) {
        console.log("sending message");
        chrome.tabs.sendMessage(tab.id, {'command': 'map_rect'}, function (resp) {
            let rect = {
                x: resp.x,
                y: resp.y,
                w: resp.width,
                h: resp.height
            };
            addImage(resultTab, data, rect);
        });
    })
}

function addImage(resultTab, data, rect) {
    log(resultTab, "printDone");
    log(resultTab, "length = " + data.length);
    cropImage(data, rect, function (cropUrl) {
        chrome.tabs.executeScript(resultTab.id, {
            'code': 'var elem = document.getElementById("img-main") ; console.log(elem); elem.src="' + cropUrl + '"'
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



