import express from 'express';
import dashboardController from '../controllers/dashboard.js';
import booksController from '../controllers/books.js';
import authMiddleware from '../middleware/home.js'

const router = express.Router()

router.get('/', authMiddleware.ensureAuth, dashboardController.getDashboard)

router.post('/books/add', authMiddleware.ensureAuth, booksController.addBook)

export default router;
