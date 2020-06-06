const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const ErrrResponse = require('../util/ErrorResponse');
const User = require('../models/User');
const sendEmail = require('../util/sendEmail');

const sendTokenResponse = (user, statusCode, res) => {
	const token = user.signJwtToken();

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		cookieOptions.secure = true;
	}

	res.status(statusCode).cookie('token', token, cookieOptions).json({
		success: true,
		token,
	});
};

//  @desc route for signing up new users
//  route POST /auth/register
//  access  public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, confirmPassword, role } = req.body;
	if (password !== confirmPassword) {
		return next(
			new ErrrResponse('confirm password muxt match with password', 400)
		);
	}
	const user = await User.create({
		name,
		password,
		email,
		confirmPassword,
		role,
	});

	sendTokenResponse(user, 201, res);
});

//  @desc route for logging in registered users
//  route POST /auth/login
//  access  public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrrResponse(`please enter an email and a password`, 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(
			new ErrrResponse(
				`A user could not be found with the email you entered`,
				401
			)
		);
	}

	isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrrResponse(`Bad credentials`, 401));
	}

	sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: {},
	});
});

//  @desc route for getting currently logged in user
//  route GET /auth/getme
//  access  private
exports.getMe = asyncHandler(async (req, res, next) => {
	const userId = req.user.id;
	const user = await User.findById(userId);
	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc	update logged in user details
// route	PUT /api/v1/auth/updatedetails
// access	Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
	const { email, name } = req.body;
	const user = await User.findById(req.user.id);

	if (!user) {
		return next(
			new ErrrResponse(`You are not permitted to access this route`),
			401
		);
	}

	await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc	update logged in password
// route	PUT /api/v1/auth/updatepassword
// access	Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const { existingpassword, newPassword } = req.body;
	const user = await User.findById(req.user.id).select('+password');
	if (!user) {
		return next(
			new ErrrResponse(`You are not permitted to access this route`),
			401
		);
	}

	isMatch = await user.matchPassword(existingpassword);
	if (!isMatch) {
		return next(
			new ErrrResponse(
				`Your existing password do not match with the one stored in the database`,
				401
			)
		);
	}

	await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc	forgotpassword
// route	GET	/api/v1/auth/forgotpassword
// access	Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return next(new ErrrResponse(`No user found with that email`, 400));
	}

	// Get reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	// Create reset url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Password reset token',
			message,
		});

		res.status(200).json({ success: true, data: 'Email sent' });
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse('Email could not be sent', 500));
	}
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new ErrrResponse('Invalid token', 400));
	}

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	sendTokenResponse(user, 200, res);
});
