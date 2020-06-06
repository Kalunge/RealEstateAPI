const express = require('express');
const {
	createTenant,
	getTenants,
	getTenant,
	deleteTenant,
	updateTenant,
} = require('../controllers/tenants');

const Tenant = require('../models/Tenant');

const router = express.Router();
const { authorize, protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router.route('/').get(advancedResults(Tenant), getTenants).post(createTenant);
router.route('/:id').get(getTenant).put(updateTenant).delete(deleteTenant);

module.exports = router;
