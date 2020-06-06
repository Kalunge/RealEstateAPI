const mongoose = require('mongoose');
const landlordSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'PLease add a landlords name'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'PLease add a landlords description'],
		},
		phoneNUmber: {
			type: Number,
			unique: [true, 'that number ia already in use'],
			required: [true, 'Please enter the landlords contact'],
		},
		email: {
			type: String,
			unique: [true, 'Another landlord exists with that email'],
			required: [true, 'You must add landlords email'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Reverse populate with virtuals
landlordSchema.virtual('blocks', {
	ref: 'Block',
	localField: '_id',
	foreignField: 'landlord',
	justOne: false,
});

module.exports = mongoose.model('Landlord', landlordSchema);
