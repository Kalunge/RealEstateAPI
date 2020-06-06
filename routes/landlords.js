const express = require('express');
const {
	createLandlord,
	getLandlords,
	getLandlord,
	deleteLandlord,
	updateLandlord,
} = require('../controllers/landlords');

const blockRoute = require('./blocks');

const Landlord = require('../models/Landlord');
const router = express.Router();
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router.use('/:landlordId/blocks', blockRoute);

router
	.route('/')
	.get(advancedResults(Landlord, 'blocks'), getLandlords)
	.post(createLandlord);
router
	.route('/:id')
	.get(getLandlord)
	.put(updateLandlord)
	.delete(deleteLandlord);

module.exports = router;
