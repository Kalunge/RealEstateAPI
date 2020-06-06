const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

const auth = require('./routes/auth');
const users = require('./routes/users');
const landlords = require('./routes/landlords');
const tenants = require('./routes/tenants');
const blocks = require('./routes/blocks');
const houses = require('./routes/houses');

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/landlords', landlords);
app.use('/api/v1/tenants', tenants);
app.use('/api/v1/blocks', blocks);
app.use('/api/v1/houses', houses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(
		`Server listening at port ${PORT} on ${process.env.NODE_ENV} mode`.yellow
			.underline.bold
	)
);
