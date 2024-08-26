import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';


export default function(passport){
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                userName: profile.displayName,
            }
            try{
                let user = await User.findOne({ googleId: profile.id })
                if(user){
                    done(null, user)
                } else{
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch(err){
                console.error(err)
            }
        }
      )
    )

    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return done(null, false, { msg: `Email ${email} not found.` });
            }
            if (!user.password) {
                return done(null, false, { 
                    msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' 
                });
            }
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { msg: 'Invalid email or password.' });
            }
        } catch (err) {
            return done(err);
        }
    }));
  
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })
  
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}