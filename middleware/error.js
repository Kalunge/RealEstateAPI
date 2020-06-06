const ErrorResponse = require('../util/ErrorResponse');

const errorHandler = function (err, req, res, next) {
	let error = { ...err };

	error.message = err.message;

	// console.log(error);
	// console.log(error.message);
	console.log(err);

	if (err.code === 11000) {
		return next(new ErrorResponse('duplicate field entered', 400));
	}

	if (err.name === 'CastError') {
		return next(new ErrorResponse('Resource not found', 400));
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server error',
	});
};

module.exports = errorHandler;
