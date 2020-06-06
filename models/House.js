const mongoose = require('mongoose');
const HouseSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'A house must have a title'],
			trim: true,
			unique: [true, 'A house with that title already exists'],
		},
		rent: {
			type: Number,
			required: [true, 'Please ad  rent for this house'],
		},
		description: {
			type: String,
			required: [
				true,
				'Please add a short decription for this house, how many bedrooms etc',
			],
		},
		numOfBedrooms: Number,
		block: {
			type: mongoose.Schema.ObjectId,
			ref: 'Block',
			required: true,
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
HouseSchema.virtual('tenant', {
	ref: 'Tenant',
	localField: '_id',
	foreignField: 'house',
	justOne: true,
});

module.exports = mongoose.model('House', HouseSchema);
