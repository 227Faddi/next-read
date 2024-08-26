import express from 'express';
import booksController from '../controllers/books.js';
import authMiddleware from '../middleware/home.js'

const router = express.Router()

router.get('/', authMiddleware.ensureAuth, booksController.getBooks)

router.put('/updateStatus/:id', authMiddleware.ensureAuth, booksController.updateStatus)

router.delete('/delete/:id', authMiddleware.ensureAuth, booksController.deleteBook)



export default router;