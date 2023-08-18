const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const config = require('./config.json');
const indexRoutes = require('./api/routes');
const itemsRoutes = require('./api/routes/items');
var path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: './.env' });

mongoose.connect(config.db.MONGOOSE_CONNECTION_STR).catch(err => {
	console.log("\n!!! Can not connect PTA-dev DB !!!\n", err.message);
	// ?? postback
});

mongoose.connection.on('connected', () => {
    console.log('Database mongodb [db-dev] connected');
    //console.log(mongoose.connection.readyState); //logs 1
});

app.use(session({
	secret: 'vEwvah8UK"r|CSN',
	resave: true,
	saveUninitialized: true
}))

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(expressValidator());
app.use(cors());
app.use('/api', indexRoutes);
app.use('/api/items', itemsRoutes);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

const server = app.listen(config.port, () => {
	console.log("Server backend listening on port " + config.port)
})





