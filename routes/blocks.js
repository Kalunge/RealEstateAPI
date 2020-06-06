const express = require('express');
const {
	createBlock,
	getBlocks,
	getBlock,
	deleteBlock,
	updateBlock,
} = require('../controllers/blocks');

const Block = require('../models/Block');

const houseRoutes = require('./houses');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router.use('/:blockId/houses', houseRoutes);

router
	.route('/')
	.get(advancedResults(Block, 'houses'), getBlocks)
	.post(createBlock);
router.route('/:id').get(getBlock).put(updateBlock).delete(deleteBlock);

module.exports = router;
