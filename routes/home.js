import express from 'express';
import homeController from '../controllers/home.js';
import authMiddleware from '../middleware/home.js'

const router = express.Router()

router.get('/', authMiddleware.ensureGuest, homeController.getHome) 

export default router;