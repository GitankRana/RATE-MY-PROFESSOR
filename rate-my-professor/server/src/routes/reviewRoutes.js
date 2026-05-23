const express = require('express');
const router = express.Router({ mergeParams: true });
const { submitReview, editReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/reviews/mine — must be before /:id routes
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: {
        professor: {
          select: { id: true, name: true, department: true, university: true }
        },
        likes: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your reviews' });
  }
});

// edit your review
router.put('/:id', authMiddleware, editReview);

// delete your review
router.delete('/:id', authMiddleware, deleteReview);

// (professor-scoped)
router.post('/', authMiddleware, submitReview);

module.exports = router;