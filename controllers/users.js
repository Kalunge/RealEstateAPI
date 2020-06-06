const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/ErrorResponse');

// @desc  GET all users in the database
// route  GET /api/v1/users/
// access Privat/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find();
	if (!users) {
		return next(new ErrorResponse(`No users in the database`));
	}

	res.status(200).json({
		success: true,
		count: users.length,
		data: users,
	});
});

// @desc  GET User
// route  GET /api/v1/users/:id
// access Privat/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(
			new ErrorResponse(`No user found with the id ${req.params.id}`),
			404
		);
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc  create User
// route  POST /api/v1/users/
// access Privat/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
	const { name, email, password, confirmPassword, role } = req.body;
	if (password !== confirmPassword) {
		return next(
			new ErrorResponse('confirm password must match with password', 400)
		);
	}
	const user = await User.create({
		name,
		password,
		email,
		confirmPassword,
		role,
	});

	res.status(201).json({
		success: true,
		data: user,
	});
});

// @desc  Update User
// route  PUT /api/v1/users/:id
// access Privat/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(
			new ErrorResponse(`No user found with the id ${req.params.id}`)
		);
	}

	await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc  delete User
// route  DELETE /api/v1/users/:id
// access Privat/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(
			new ErrorResponse(`No user found with the id ${req.params.id}`)
		);
	}

	await User.findByIdAndRemove(req.params.id);

	res.status(200).json({
		success: true,
		data: {},
	});
});
