const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/professors/:id/reviews
const submitReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment, tags } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ error: 'Comment is required' });
  }

  try {
    const existing = await prisma.review.findFirst({
      where: { userId, professorId: parseInt(id) },
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this professor' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        tags: tags || [],
        userId,
        professorId: parseInt(id),
      },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// PUT /api/reviews/:id
const editReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment, tags } = req.body;
  const userId = req.user.id;

  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        rating: parseInt(rating),
        comment,
        tags: tags || [],
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to edit review' });
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.reviewLike.deleteMany({ where: { reviewId: parseInt(id) } });
    await prisma.review.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

module.exports = { submitReview, editReview, deleteReview };