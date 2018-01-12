console.log("in page.js");

function getRect(elemId) {
    let elem = document.getElementById(elemId);
    return elem.getBoundingClientRect();
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let resp = null;
        if (request.command == "map_rect") {
            resp = getRect("mapcontainer");
        }
        console.log("request = ", request, " resp =", resp);
        sendResponse(resp);
    });



