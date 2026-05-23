const express = require('express');
const router = express.Router();
const { likeReview } = require('../controllers/likeController');
const { editReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:id/like', authMiddleware, likeReview);
router.put('/:id', authMiddleware, editReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;