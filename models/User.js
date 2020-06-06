const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Please add a email'],
			unique: [true, 'That email already exists'],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a vcalid email',
			],
		},
		password: {
			type: String,
			select: false,
			minlength: 5,
			required: [true, 'PLease add a password'],
		},
		confirmPassword: {
			type: String,
			required: [true, 'you must confirm your password'],
			select: false,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		role: {
			type: String,
			enum: ['tenant', 'manager', 'user'],
			default: 'user',
		},
	},
	{ timestamps: true }
);

UserSchema.methods.signJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_SECRET_EXPIRE,
	});
};

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hashSync(this.password, salt);
	this.confirmPassword = await bcrypt.hashSync(this.confirmPassword, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
