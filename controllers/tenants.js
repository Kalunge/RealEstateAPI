const Tenant = require('../models/Tenant');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/ErrorResponse');
const advancedResults = require('../middleware/advancedResults');

//  @desc get Tenant
//  route GET /api/v1/tenants/:id
//  access  Private
exports.getTenant = asyncHandler(async (req, res, next) => {
	const tenant = await Tenant.findById(req.params.id);

	if (!tenant) {
		return next(
			new ErrorResponse(`No tenant found with the id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: tenant,
	});
});

//  @desc get tenants
//  route GET /api/v1/tenants
//  access  Private
exports.getTenants = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

//  @desc route for adding new tenants
//  route POST/tenants/addtenant
//  access  Private
exports.createTenant = asyncHandler(async (req, res, next) => {
	req.body.user = req.user;

	const tenant = await Tenant.create(req.body);

	res.status(201).json({
		success: true,
		data: tenant,
	});
});

//  @desc Delete tenant
//  route POST/tenants/:id
//  access  Private
exports.deleteTenant = asyncHandler(async (req, res, next) => {
	const tenant = await Tenant.findById(req.params.id);
	if (!tenant) {
		return next(
			new ErrorResponse(`No tenant found with the id ${req.params.id}`, 404)
		);
	}

	if (tenant.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this tenant therefore you cannot delete it`,
				401
			)
		);
	}

	await tenant.remove();

	res.status(201).json({
		success: true,
		data: {},
	});
});

//  @desc Delete tenant
//  route POST/tenants/:id
//  access  Private
exports.updateTenant = asyncHandler(async (req, res, next) => {
	const { name, email, phoneNUmber, description } = req.body;
	let tenant = await Tenant.findById(req.params.id);

	if (!tenant) {
		return next(
			new ErrorResponse(`No tenant found with the id ${req.params.id}`, 404)
		);
	}

	if (tenant.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(
				`You are not the owner of this tenant therefore you cannot delete it`,
				401
			)
		);
	}

	tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({
		success: true,
		data: tenant,
	});
});
