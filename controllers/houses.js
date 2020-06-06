const House = require('../models/House');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/ErrorResponse');
const advancedResults = require('../middleware/advancedResults');

//  @desc get House
//  route GET /api/v1/houses/:id
//  access  Private
exports.getHouse = asyncHandler(async (req, res, next) => {
	const house = await House.findById(req.params.id).populate({
		path: 'tenant',
		select: 'name',
	});

	if (!house) {
		return next(
			new ErrorResponse(`No house found with the id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: house,
	});
});

//  @desc get houses
//  route GET /api/v1/blocks/:id/houses
//  access  Private
exports.getHouses = asyncHandler(async (req, res, next) => {
	if (req.params.blockId) {
		const houses = await House.find({ block: req.params.blockId });
		res.status(200).json({
			success: true,
			count: houses.length,
			data: houses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

//  @desc route for adding new houses
//  route POST/houses/addhouse
//  access  Private
exports.createHouse = asyncHandler(async (req, res, next) => {
	req.body.user = req.user;

	const house = await House.create(req.body);

	res.status(201).json({
		success: true,
		data: house,
	});
});

//  @desc Delete house
//  route POST/houses/:id
//  access  Private
exports.deleteHouse = asyncHandler(async (req, res, next) => {
	const house = await House.findById(req.params.id);
	if (!house) {
		return next(
			new ErrorResponse(`No house found with the id ${req.params.id}`, 404)
		);
	}

	if (house.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this house therefore you cannot delete it`,
				401
			)
		);
	}

	await house.remove();

	res.status(201).json({
		success: true,
		data: {},
	});
});

//  @desc Update house
//  route POST/houses/:id
//  access  Private
exports.updateHouse = asyncHandler(async (req, res, next) => {
	const { title, numOfBedrooms, description, rent } = req.body;

	let house = await House.findById(req.params.id);

	if (!house) {
		return next(
			new ErrorResponse(`No house found with the id ${req.params.id}`, 404)
		);
	}

	if (house.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this house therefore you cannot delete it`,
				401
			)
		);
	}

	house = await House.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({
		success: true,
		data: house,
	});
});
