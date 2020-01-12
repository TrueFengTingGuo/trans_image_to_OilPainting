const express = require('express')
const bodyParser = require('body-parser')

const app = express();

//set the template engine ejs
app.set('view engine', 'ejs');

//middleware
app.use(express.static(__dirname + '/public'));

//routes
app.get('/', (req, res) => {
    res.render('index')
})

//Listen on port 3000
server = app.listen(3000)

app.post('/upload', (req, res) => {
    console.log(req);
});






