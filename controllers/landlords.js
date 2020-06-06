const Landlord = require('../models/Landlord');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/ErrorResponse');
const advancedResults = require('../middleware/advancedResults');

//  @desc get Landlord
//  route GET /api/v1/landlords/:id
//  access  Private
exports.getLandlord = asyncHandler(async (req, res, next) => {
	const landlord = await Landlord.findById(req.params.id);

	if (!landlord) {
		return next(
			new ErrorResponse(`No landlord found with the id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: landlord,
	});
});

//  @desc get Landlords
//  route GET /api/v1/landlords
//  access  Private
exports.getLandlords = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

//  @desc route for adding new landlords
//  route POST/landlords/addlandlord
//  access  Private
exports.createLandlord = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id;

	const landlord = await Landlord.create(req.body);

	res.status(201).json({
		success: true,
		data: landlord,
	});
});

//  @desc Delete Landlord
//  route POST/landlords/:id
//  access  Private
exports.deleteLandlord = asyncHandler(async (req, res, next) => {
	const landlord = await Landlord.findById(req.params.id);
	if (!landlord) {
		return next(
			new ErrorResponse(`No landlord found with the id ${req.params.id}`, 404)
		);
	}

	if (landlord.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this landlord therefore you cannot delete it`,
				401
			)
		);
	}

	await landlord.remove();

	res.status(201).json({
		success: true,
		data: {},
	});
});

//  @desc Delete Landlord
//  route POST/landlords/:id
//  access  Private
exports.updateLandlord = asyncHandler(async (req, res, next) => {
	const { name, email, phoneNUmber, description } = req.body;
	let landlord = await Landlord.findById(req.params.id);

	if (!landlord) {
		return next(
			new ErrorResponse(`No landlord found with the id ${req.params.id}`, 404)
		);
	}

	if (landlord.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this landlord therefore you cannot delete it`,
				401
			)
		);
	}

	landlord = await Landlord.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({
		success: true,
		data: landlord,
	});
});
