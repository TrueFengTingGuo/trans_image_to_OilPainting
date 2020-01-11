const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');

const app = express();

//set the template engine ejs
app.set('view engine', 'ejs');

//middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client_image')
    },
    filename: function (req, file, cb) {
        console.log(file.mimetype);
        if (file.mimetype === 'image/png') {
            cb(null, file.fieldname + '-' + Date.now() + '.png')
        }
        else {
            cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
        }

    }
})

var upload = multer({ storage: storage })

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
    res.render('index')

})








