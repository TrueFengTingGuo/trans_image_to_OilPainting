var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext("2d");
var imageData;

document.getElementById('myFile').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage(fr);
        fr.readAsDataURL(files[0]);
    }
}

function showImage(fileReader) {
    var img = document.getElementById("myImage");
    img.onload = () => getImageData(img);
    img.src = fileReader.result;
}

function getImageData(img) {
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, img.width, img.height);
    console.log("image data:", imageData.data);

    changePixel(imageData.data);

    ctx.putImageData(imageData, 0, 0);
    console.log("image data:", imageData.data);
}


function changePixel(data) {
    for (var i = 0; i < data.length; i++) {
        data[i] = 50;
    }
}