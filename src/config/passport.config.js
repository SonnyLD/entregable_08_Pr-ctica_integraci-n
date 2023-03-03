import passportLocal from 'passport-local';
import * as UserService from "../services/user.service.js";
import * as authServices from '../services/auth.service.js'
import passportGithub from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

function passportConfig(passport) {
  passport.use(
    'github',
    new passportGithub.Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8081/api/github/callback', // This should be changed accordingly to the environment and stage of the proyect
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserService.getUser(profile._json.email);

          if (!user) {
            const names = [
              profile.displayName.split(' ')[0],
              profile.displayName.split(' ')[1],
            ]; // Asuming only one name
            const userData = {
              firstName: names[0],
              lastName: names[1],
              email: profile._json.email,
              age: 20,
              password: '',
              platform: 'github',
            };
            const newUser = await UserService.createUser(userData);
            return done(null, newUser);
          }

          delete user.password;

          done(null, user);
        } catch (error) {
          throw new Error(error.message);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing');
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    console.log('Deserializing');
    const user = await UserService.getUserById(_id);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  });
}

export default passportConfig;