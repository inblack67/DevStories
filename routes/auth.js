const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/google',passport.authenticate('google',{
  scope: ['profile','email']

  // scope of what we need from user -> his profile and email
}));

router.get('/google/callback',passport.authenticate('google',{
  failureRedirect: '/'
}),(req,res)=> {
  res.redirect('/dashboard');
} );


module.exports = router;