import passport from "passport";
import {Strategy} from 'passport-local';
import {ExtractJwt} from "passport-jwt";
import  UserModel  from '../dao/models/users.models.js'
import * as userService from "../services/user.service.js";
import * as authServices from '../services/auth.service.js'

import dotenv from 'dotenv'
dotenv.config()

passport.serializeUser(function (user, done) {
  console.log("Serializing");
  done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
  console.log("Deserializing");
  UserModel.findById(_id, function (err, user) {
    done(err, user);
  });
});

passport.use("jwtToken", new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:process.env.SECRET
}, async function (jwtPayload,done) {
  console.log(jwtPayload)
  done(null,jwtPayload.user)
}))


function extractor(req) {
  console.log(req)
  if (req?.cookies['coderhouse']) {
    const token = req.cookies['coderhouse']
    return token
  }
  return false
}

passport.use('jwtCookie', new Strategy({
  jwtFromRequest:ExtractJwt.fromExtractors([extractor]),
  secretOrKey:process.env.SECRET
}, async function (jwtPayload, done) {
  console.log(jwtPayload)
  done(null, jwtPayload.user)
}))

// passport.use('jwtCookie', new Strategy({
//   jwtFromRequest:ExtractJwt.,
//   secretOrKey:process.env.SECRET
// }, async function (jwtPayload, done) {
//   console.log(jwtPayload)
//   done(null, jwtPayload.user)
// }))

passport.use(
  "signup",
  new Strategy({ passReqToCallback: true, usernameField: "email" }, async function (
    req,
    username,
    password,
    done,
  ) {
    try {
      console.log("req.body:", req.body);
      const userExist = await UserModel.findOne({ email: username });
      console.log("userExist:", userExist);

      if (userExist) {
        console.log("User already exists");
        return done("El usuario ya existe", false);

      } else {
        const userData = {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          age: req.body.age,
        };
        console.log("userData:", userData);
        const user = await userService.createUser(userData);

        console.log("User created:", user);
        return done(null, user);
      }
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw new Error(error.message);
    }
  }),
);


passport.use("login", 
new Strategy({passReqToCallback:true, usernameField:'email'}, async function (
  req,
  username,
  password,
  done
  
  ) {
 
  try {
      const user = await UserModel.findOne({ email: username });
      
      if (!user) {
        return done(null, false, { message: 'User not found', email: username });
      }
      const login = await authServices.login(username, password)
      if (login) {
        return done(null, user);
    } else {
      return done(null,false, { message: 'Invalid password' })
    }
  } catch (error) {
    return done(error);
  }
}));

export default passport;