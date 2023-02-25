import express from 'express';
import passport from 'passport';

const githubRouter = express.Router();

githubRouter.get('/failed', (req, res) => {
  console.log('error')
  res.render('error', {error: 'something went wrong'})
})

githubRouter.get('/login', passport.authenticate("github",{scope:["user:email"]}))

githubRouter.get('/callback', passport.authenticate('github',{failureRedirect:'/api/github/failed'}), (req, res) => {
  res.redirect('/');
});

export default githubRouter;