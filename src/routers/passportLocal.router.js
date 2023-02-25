import express from 'express';
import passport from 'passport';
import * as passportController from '../controllers/passport.controller.js';

const passportLocalRouter = express.Router();

passportLocalRouter.get('/failed', passportController.fail);

passportLocalRouter.post(
  '/signup',
  passport.authenticate('signup', {
    failureRedirect: '/failed',
/*     //failureRedirect: '/api/passportLocal/fail', */
  }),
  passportController.signUp
);

passportLocalRouter.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/failed',
/*     //failureRedirect: '/api/passportLocal/fail', */
  }),
  passportController.login
);

passportLocalRouter.post('/logout', passportController.logout);

export default passportLocalRouter;