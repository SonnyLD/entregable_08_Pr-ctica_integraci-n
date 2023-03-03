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
      const userExist = await UserModel.findOne({ email: username });
      if (userExist) {
        return done("El usuario ya existe", false);
      } else {
        const user = await userService.createUser(req.body);
        return done(null, user);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }),
);

passport.use("login", new Strategy({passReqToCallback:true, usernameField:'email'}, async function (req,username,password,done) {
  try {
    const login = await authServices.login(username, password)
    if (login) {
      const user = await UserModel.findOne({ email: username });
      return done(null,user)
    } else {
      return done(null,false)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}))

export default passport;