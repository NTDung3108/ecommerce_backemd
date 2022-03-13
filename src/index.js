const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();

var port = 3000;

var host = '10.50.10.90';

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Routes
app.use( require('./Routes/route') );

app.use(express.static(path.join(__dirname, 'Uploads/Profile')));
app.use(express.static(path.join(__dirname, 'Uploads/Home')));
app.use(express.static(path.join(__dirname, 'Uploads/Products')));
app.use(express.static(path.join(__dirname, 'Uploads/Categories')));


app.listen(port, host,() => console.log('Listen on port ' + port + host));
