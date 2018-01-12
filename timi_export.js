console.log("Loaded");

document.addEventListener("DOMContentLoaded", function (dcle) {
    console.log("content loaded");
    document.getElementById("export-page").addEventListener("click", function () {
        chrome.runtime.sendMessage({print: true}, function(response) {
            console.log(response);
        });
    });
});

function printTab(tab) {
    console.log("printing tab url = " + tab.url);
}


