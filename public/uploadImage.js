var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext("2d");
var imageData;

document.getElementById('myFile').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader suport
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage(fr);
        fr.readAsDataURL(files[0]);
    }
}

function showImage(fileReader) {
    var img = new Image()
    img.onload = () => getImageData(img);
    img.src = fileReader.result;

}

function getImageData(img) {

    canvas.width = img.width;
    canvas.height = img.height;
    //console.log(img.width + " , " + img.height);
    ctx.drawImage(img, 0, 0);

    imageData = ctx.getImageData(0, 0, img.width, img.height);
    // console.log("image data:", imageData.data);

    SimplifyColours(imageData.data, img.width, img.height);

    //ctx.putImageData(imageData, 0, 0);
    //console.log("Painting");
    //console.log("image data:", imageData.data);
}


function SimplifyColours(Local_imageData, imageWidth, imageHeight) {

    var twoD_ImageData = []; // this will contain all pixels
    var columnArray = [];
    var columnCount = 0;

    //group all pixels into one 2d array ////////////////
    for (i = 0; i < Local_imageData.length; i += 4) {

        //group one pixel into an array
        var onePixel = [];
        onePixel.push(Local_imageData[i]);
        onePixel.push(Local_imageData[i + 1]);
        onePixel.push(Local_imageData[i + 2]);
        onePixel.push(Local_imageData[i + 3]);
        //console.log(onePixel);

        columnCount++;
        columnArray.push(onePixel);
        //if processed one column, add into 2d array

        if (columnCount >= imageWidth) {

            twoD_ImageData.push(columnArray);
            columnCount = 0;
            columnArray = [];
        }

    }

    //simplify colours/////////////

    //create a 2d array to check if we visit a pixel already
    var checkedPixel = [];
    for (heightCount = 0; heightCount < imageHeight; heightCount++) {
        var columnPixels = [];
        for (widthCount = 0; widthCount < imageWidth; widthCount++) {
            columnPixels.push(false);
        }
        checkedPixel.push(columnPixels);
    }

    //go through all pixels, change pixels' values
    for (heightCount = 0; heightCount < imageHeight; heightCount++) {

        for (widthCount = 0; widthCount < imageWidth; widthCount++) {


            if (checkedPixel[heightCount][widthCount]) {
                //if the pixel is checked
                //console.log("checked------" + widthCount + heightCount);
            }
            else {

                //if the pixel didn't check
                var aGroupOfSimilarPixels = [];
                var sumRGB = twoD_ImageData[heightCount][widthCount];
                var similarPixelCount = 1;

                //goThrough_Similar_Pixels
                for (Similar_Pixels_heightCount = 0; Similar_Pixels_heightCount < imageHeight; Similar_Pixels_heightCount++) {

                    for (Similar_Pixels_widthCount = 0; Similar_Pixels_widthCount < imageWidth; Similar_Pixels_widthCount++) {
                        goThrough_Similar_Pixels(Similar_Pixels_widthCount, Similar_Pixels_heightCount, aGroupOfSimilarPixels, sumRGB, similarPixelCount);
                        //console.log(aGroupOfSimilarPixels);
                    }
                }

                //re-add pixels
                for (similarPixelsCount = 0; similarPixelsCount < aGroupOfSimilarPixels.length; similarPixelsCount++) {


                    twoD_ImageData[aGroupOfSimilarPixels[similarPixelsCount][0]][aGroupOfSimilarPixels[similarPixelsCount][1]] = sumRGB / aGroupOfSimilarPixels.length;

                }

                //return 2d into 1d
                var pixelCount = 0;
                for (Convert_heightCount = 0; Convert_heightCount < imageHeight; Convert_heightCount++) {

                    for (Convert_widthCount = 0; Convert_widthCount < imageWidth; Convert_widthCount++) {

                        //console.log(Convert_heightCount, widthCount);
                        Local_imageData[pixelCount] = twoD_ImageData[Convert_heightCount][Convert_widthCount][0];
                        Local_imageData[pixelCount + 1] = twoD_ImageData[Convert_heightCount][Convert_widthCount][1];
                        Local_imageData[pixelCount + 2] = twoD_ImageData[Convert_heightCount][Convert_widthCount][2];
                        Local_imageData[pixelCount + 3] = twoD_ImageData[Convert_heightCount][Convert_widthCount][3];
                        pixelCount += 4;

                    }
                }

                imageData.data = Local_imageData;

                ctx.putImageData(imageData, 0, 0);
                var end = performance.now();
            }
        }
    }



    //process end here
    return

    //find all similar pixels, and calculate the average pixel values
    //totalPixelValues is an array with 4 values(R G B A)
    //similarPixelsArray will record all similar pixels
    function checkFor_Similar_Pixels(pixel_X, pixel_Y, similarPixelsArray, totalPixelValues, pixelCount) {


        if ((difference(totalPixelValues[0] / pixelCount, twoD_ImageData[pixel_Y][pixel_X][0]) < 25) &&
            (difference(totalPixelValues[1] / pixelCount, twoD_ImageData[pixel_Y][pixel_X][1]) < 25) &&
            (difference(totalPixelValues[2] / pixelCount, twoD_ImageData[pixel_Y][pixel_X][2]) < 25)) {

            //console.log('added ' + pixel_X + '  ' + pixel_Y);
            //if find similar pixels

            //remember this pixels
            checkedPixel[pixel_Y][pixel_X] = true;
            similarPixelsArray.push([pixel_Y, pixel_X]);

            //calculate the average of the pixels
            totalPixelValues[0] += (twoD_ImageData[pixel_Y][pixel_X][0]);
            totalPixelValues[1] += (twoD_ImageData[pixel_Y][pixel_X][1]);
            totalPixelValues[2] += (twoD_ImageData[pixel_Y][pixel_X][2]);
            pixelCount += 1;
            return true

        }
        else {
            //console.log('too much different passed' + pixel_X + '  ' + pixel_Y);
            return false
        }

    }

    //found all possible path for tracing any similar pixels
    function checkForNextAvailablePixel(pixel_X, pixel_Y) {
        //console.log(pixel_X, pixel_Y);

        if (imageWidth - 1 < pixel_X
            || imageHeight - 1 < pixel_Y
            || pixel_X < 0
            || pixel_Y < 0) {

            //console.log('passed' + pixel_X + '  ' + pixel_Y);
            return false
        }
        else if (checkedPixel[pixel_Y][pixel_X]) {
            //console.log('checked so pass   -------- ' + pixel_X + '  ' + pixel_Y);
            return false
        }
    }
}

function difference(a, b) {
    return Math.abs(a - b);
}