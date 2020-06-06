const Block = require('../models/Block');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/ErrorResponse');
const advancedResults = require('../middleware/advancedResults');

//  @desc get block
//  route GET /api/v1/blocks/:id
//  access  Private
exports.getBlock = asyncHandler(async (req, res, next) => {
	const block = await Block.findById(req.params.id)
		.populate({ path: 'houses', select: 'name' })
		.populate({ path: 'tenants', select: 'name' });

	if (!block) {
		return next(
			new ErrorResponse(`No block found with the id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: block,
	});
});

//  @desc get blocks
//  route GET /api/v1/blocks
//  access  Private
exports.getBlocks = asyncHandler(async (req, res, next) => {
	if (req.params.landlordId) {
		const blocks = await Block.find({ landlord: req.params.landlordId });
		res.status(200).json({
			success: true,
			count: blocks.length,
			data: blocks,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

//  @desc route for adding new blocks
//  route POST/blocks/
//  access  Private
exports.createBlock = asyncHandler(async (req, res, next) => {
	req.body.user = req.user;

	const block = await Block.create(req.body);

	res.status(201).json({
		success: true,
		data: block,
	});
});

//  @desc Delete block
//  route POST/blocks/:id
//  access  Private
exports.deleteBlock = asyncHandler(async (req, res, next) => {
	const block = await Block.findById(req.params.id);
	if (!Block) {
		return next(
			new ErrorResponse(`No Block found with the id ${req.params.id}`, 404)
		);
	}

	if (block.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this block therefore you cannot delete it`,
				401
			)
		);
	}

	await block.remove();

	res.status(201).json({
		success: true,
		data: {},
	});
});

//  @desc Update block
//  route POST/block/:id
//  access  Private
exports.updateBlock = asyncHandler(async (req, res, next) => {
	const { title, location, description } = req.body;

	let block = await Block.findById(req.params.id);

	if (!block) {
		return next(
			new ErrorResponse(`No block found with the id ${req.params.id}`, 404)
		);
	}

	if (block.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this block therefore you cannot update it`,
				401
			)
		);
	}

	block = await Block.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({
		success: true,
		data: block,
	});
});
