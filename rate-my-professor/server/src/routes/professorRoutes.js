const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllProfessors, getProfessorById, createProfessor } = require('../controllers/professorController');

router.get('/', getAllProfessors);
router.post('/', authMiddleware, createProfessor);
router.get('/:id', getProfessorById);

module.exports = router;