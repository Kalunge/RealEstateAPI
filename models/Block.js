// - name => String
// - location => Geo
// - hiuses => list => relationship
// - manager => relationship
// - tenants =>list => relationship
// - totalRent => method
// - timestamps => Date
// - landlord => relationship
// - averageReview => method
const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'please add a title for your block'],
			unique: [true, 'There is another Block with that title'],
		},
		description: {
			type: String,
			required: [true, 'Please add a short description of your block'],
			maxlength: [200, 'Description cannot exceed 200 characters'],
		},
		location: String,
		landlord: {
			type: mongoose.Schema.ObjectId,
			ref: 'Landlord',
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
BlockSchema.virtual('houses', {
	ref: 'House',
	localField: '_id',
	foreignField: 'block',
	justOne: false,
});

BlockSchema.pre('find', function () {
	this.populate({ path: 'houses', select: 'title' });
});
module.exports = mongoose.model('Block', BlockSchema);
