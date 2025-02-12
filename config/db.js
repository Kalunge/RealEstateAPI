const mongoose = require('mongoose');

const connectDb = async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});

	console.log(
		`connected to mongoDb @ ${conn.connection.host}`.cyan.underline.bold
	);
};

module.exports = connectDb;
