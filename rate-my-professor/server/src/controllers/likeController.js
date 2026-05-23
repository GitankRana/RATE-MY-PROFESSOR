const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/reviews/:id/like
const likeReview = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // "LIKE" or "DISLIKE"
  const userId = req.user.id;

  if (!['LIKE', 'DISLIKE'].includes(type)) {
    return res.status(400).json({ error: 'Type must be LIKE or DISLIKE' });
  }

  try {
    const existing = await prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId, reviewId: parseInt(id) } },
    });

    if (existing) {
      if (existing.type === type) {
        // Same vote again — remove it (toggle off)
        await prisma.reviewLike.delete({
          where: { id: existing.id },
        });
        return res.json({ message: 'Vote removed' });
      } else {
        // Switching vote (like → dislike or vice versa)
        await prisma.reviewLike.update({
          where: { id: existing.id },
          data: { type },
        });
        return res.json({ message: 'Vote updated' });
      }
    }

    // New vote
    await prisma.reviewLike.create({
      data: {
        type,
        userId,
        reviewId: parseInt(id),
      },
    });

    res.status(201).json({ message: 'Vote recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record vote' });
  }
};

module.exports = { likeReview };