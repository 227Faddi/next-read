import passport from 'passport';
import validator from 'validator';
import User from '../models/User.js';


export default {
  googleCallback: (req, res) => {
      res.redirect('/dashboard')
  },
  getLogin: (req, res) => {
    if (req.user) {
      return res.redirect('/dashboard')
    }
    res.render('login', {
      title: 'Login'
    })
  },
  getSignup: (req, res) => {
    if (req.user) {
      return res.redirect('/dashboard')
    }
    res.render('signup', {
      title: 'Create Account'
    })
  },
  postLogin: (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/auth/login')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('errors', info)
        return res.redirect('/auth/login')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect(req.session.returnTo || '/dashboard')
      })
    })(req, res, next)
  },
  postSignup: async (req, res, next) => {
    try{
      // Validate input
      const validationErrors = [];
      if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
      if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
      if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });
      if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('/auth/signup');
      }
      // Normalize email
      req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
      // Check for existing user
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { userName: req.body.userName }]
      });
      if (existingUser) {
        req.flash('errors', { msg: 'An account with this email address or username already exists. Please choose a different one.' });
        return res.redirect('/auth/signup');
      }
      // Create new user
      const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
      });
      await user.save();
      // Log the user in
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/dashboard');
      });
    } catch (err) {
      return next(err);
    }
  },
  logout: (req, res, next) => {
    req.logout((error) => {
      if (error) {return next(error)}
      res.redirect('/')
    })
  }
}