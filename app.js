const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const path = require('path');

// Load environment variables first
require('dotenv').config({ path: './.env' });

// Fallback to config.json if env vars not set (for backwards compatibility)
let config = {};
try {
	config = require('./config.json');
} catch (e) {
	console.log('config.json not found, using environment variables');
}

const indexRoutes = require('./api/routes');
const itemsRoutes = require('./api/routes/items');
const transactionRoutes = require('./api/routes/transaction');
const sellersRoutes = require('./api/routes/sellers');
const customersRoutes = require('./api/routes/customers');
const buyitemsRoutes = require('./api/routes/buy-items');

// Use environment variables with fallback to config
const MONGODB_URI = process.env.MONGODB_URI || config.db?.MONGOOSE_CONNECTION_STR;
const PORT = process.env.PORT || config.port || 4040;
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-in-production';

if (!MONGODB_URI) {
	console.error('ERROR: MONGODB_URI is not set. Please set it in .env file or config.json');
	process.exit(1);
}

mongoose.connect(MONGODB_URI).catch(err => {
	console.log("\n!!! Can not connect to DB !!!\n", err.message);
});

mongoose.connection.on('connected', () => {
    console.log('Database mongodb connected');
});

app.use(session({
	secret: SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}
}))

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use((error, req, res, next) => {
	if (!error) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers", "*");
		next();
	} else {
		console.error(error);
    	res.send(500);
	}
});
app.use(bodyParser.json());
//app.use(fileUpload());
app.use(expressValidator());
app.use(cors());
app.use('/api', indexRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/buyitems', buyitemsRoutes);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		service: 'backend',
		timestamp: new Date().toISOString(),
		database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
	});
});

const server = app.listen(PORT, () => {
	console.log("Server backend listening on port " + PORT)
})





