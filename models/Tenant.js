const mongoose = require('mongoose');
const TenantSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'PLease add a tenants name'],
		trim: true,
	},
	description: {
		type: String,
		required: [true, 'PLease add a tenants description'],
	},
	phoneNUmber: {
		type: Number,
		required: [true, 'Please enter the tenants contact'],
	},
	email: {
		type: String,
		unique: [true, 'Another tenant exists with that email'],
		required: [true, 'You must add tenants email'],
	},
	house: {
		type: mongoose.Schema.ObjectId,
		ref: 'House',
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

module.exports = mongoose.model('Tenant', TenantSchema);
