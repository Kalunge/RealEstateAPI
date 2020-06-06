const express = require('express');
const {
	createHouse,
	getHouses,
	getHouse,
	deleteHouse,
	updateHouse,
} = require('../controllers/houses');

const House = require('../models/House');

const router = express.Router({ mergeParams: true });
const { authorize, protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router
	.route('/')
	.get(advancedResults(House, 'tenant'), getHouses)
	.post(createHouse);
router.route('/:id').get(getHouse).put(updateHouse).delete(deleteHouse);

module.exports = router;
