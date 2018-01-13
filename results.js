console.log("results.js");

chrome.runtime.onMessage.addListener(
    function (request, sender, callback) {
        let resp = null;
        if (request.command == "add_image") {
            let data = request.data;
            let rect = request.rect;
            let title = request.title;
            console.log("In addImage title = " + title);
            let results = document.getElementById("results");
            let row = appendRow(results);
            let img = appendPanelWithImage(row, title, 12);
            console.log("appended row for title " + title);
            cropImage(data, rect, function(croppedDataUrl) {
                img.src = croppedDataUrl;
                callback(true);
            });
        }

    });

function appendRow(parent) {
    let div = document.createElement("div");
    div.className ="row";
    parent.appendChild(div);
    return div;
}

function appendPanelWithImage(row, title, colSize) {
    let panel = document.createElement("div");
    panel.className = "panel panel-primary";
    let heading = document.createElement("div");
    heading.className = "panel-heading";
    let body = document.createElement("div");
    body.className = "panel-body";
    panel.appendChild(heading);
    panel.appendChild(body);
    let text = document.createTextNode(title);
    heading.appendChild(text);
    let img = document.createElement("img");
    body.appendChild(img);
    let col = document.createElement("div");
    col.className = "col-xs-12 col-sm-" + colSize;
    col.appendChild(panel);
    row.appendChild(col);
    return img;
}

function createRowCol12() {
    let div = document.createElement("div");
    div.className = "row";
    let col = document.createElement("div");
    col.className = "col-xs-12";
    div.appendChild(col);
    return col;
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




