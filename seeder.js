const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Landlord = require('./models/Landlord');
const Block = require('./models/Block');
const House = require('./models/House');
// const User = require('./models/User');
const Tenant = require('./models/Tenant');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

// Read JSON files
const landlords = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/landlords.json`, 'utf-8')
);

const blocks = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/blocks.json`, 'utf-8')
);

const houses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/houses.json`, 'utf-8')
);

const tenants = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/tenants.json`, 'utf-8')
);

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );

// Import into DB
const importData = async () => {
	try {
		// await Landlord.create(landlords);
		await Landlord.create(landlords);
		await Block.create(blocks);
		await House.create(houses);
		await Tenant.create(tenants);
		console.log('Data Imported...'.green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Landlord.deleteMany();
		await Block.deleteMany();
		await House.deleteMany();
		await Tenant.deleteMany();
		console.log('Data Destroyed...'.red.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
