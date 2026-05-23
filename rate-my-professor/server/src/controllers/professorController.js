const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/professors
const getAllProfessors = async (req, res) => {
    try {
        const professors = await prisma.professor.findMany({
            include: {
                reviews: {
                    select: { rating: true },
                },
            },
        });

        const result = professors.map((prof) => {
            const ratings = prof.reviews.map((r) => r.rating);
            const avgRating =
                ratings.length > 0
                    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                    : null;

            return {
                id: prof.id,
                name: prof.name,
                department: prof.department,
                university: prof.university,
                bio: prof.bio,
                avgRating,
                reviewCount: ratings.length,
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch professors' });
    }
};

// GET /api/professors/:id
const getProfessorById = async (req, res) => {
    const { id } = req.params;

    try {
        const professor = await prisma.professor.findUnique({
            where: { id: parseInt(id) },
            include: {
                reviews: {
                    include: {
                        user: { select: { name: true } },
                        likes: true, // include likes/dislikes
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!professor) {
            return res.status(404).json({ error: 'Professor not found' });
        }

        const ratings = professor.reviews.map((r) => r.rating);
        const avgRating =
            ratings.length > 0
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                : null;

        // Add like/dislike counts to each review
        const reviews = professor.reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            tags: review.tags, // add this
            createdAt: review.createdAt,
            user: review.user,
            userId: review.userId,
            likes: review.likes.filter((l) => l.type === 'LIKE').length,
            dislikes: review.likes.filter((l) => l.type === 'DISLIKE').length,
        }));
        res.json({ ...professor, reviews, avgRating, reviewCount: ratings.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch professor' });
    }
};

// POST /api/professors
const createProfessor = async (req, res) => {
    const { name, department, university, bio } = req.body;

    if (!name || !department || !university) {
        return res.status(400).json({ error: 'Name, department and university are required' });
    }

    try {
        const professor = await prisma.professor.create({
            data: { name, department, university, bio: bio || '' },
        });

        res.status(201).json(professor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create professor' });
    }
};

module.exports = { getAllProfessors, getProfessorById, createProfessor };