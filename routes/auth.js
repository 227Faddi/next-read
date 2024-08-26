import express from 'express';
import passport from 'passport';
import authController from '../controllers/auth.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback)

router.get('/logout', authController.logout)

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', authController.postLogin)

router.post('/signup', authController.postSignup)

export default router;