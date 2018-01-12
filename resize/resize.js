function start() {
    console.log(dataUrl.length);
    document.getElementById("orig").src = dataUrl;
    var rect = {h: 561, x: 0, y: 85, w: 1299};
    cropImage(dataUrl, rect, function(cropUrl) {
        document.getElementById("crop").src = cropUrl;
    });
}

function cropImage(dataUrl, rect, callback) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = rect.w;
    canvas.height = rect.h;
    img = document.createElement("img");
    img.src = dataUrl;
    img.onload = function() {
       ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h,0, 0, rect.w, rect.h);
       callback(canvas.toDataURL());
    };
}
