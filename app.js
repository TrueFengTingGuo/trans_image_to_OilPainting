const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express()

//set the template engine ejs
app.set('view engine', 'ejs')

//middleware
app.use(express.static('public'))
app.use(bodyParser.json()); //Node.js body parsing middleware.

//create a storage which says where and how the files/images should be saved.
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./client_image");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}); //Field name and max count

//routes
app.get('/', (req, res) => {
    res.render('index')
})

//Listen on port 3000
server = app.listen(3000)

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        res.render('index')
        return
    }
    else {
        res.render('index')
        processImage(file.buffer)
    }

})

function processImage(imageBuffer) {
    console.log(imageBuffer.getImageData(10, 10, 50, 50));
}







