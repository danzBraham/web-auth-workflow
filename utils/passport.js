import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log({ accessToken, refreshToken, profile, cb });
    }
  )
);
