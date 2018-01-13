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
        else if (request.command == "lis_count") {
            resp = document.getElementsByClassName("li-research-field").length;
        }
        else if (request.command == "show_li") {
            let index = request.index;
            let lis = document.getElementsByClassName("li-research-field");
            for (let li of lis) {
                li.style.display = "none";
            }
            lis[index].style.display = "block";
            resp = true;
        }
        console.log("request = ", request, " resp =", resp);
        sendResponse(resp);
    });



