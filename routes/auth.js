const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/google',passport.authenticate('google',{

  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]
  // scope of what we need from user -> his profile and email
}));

router.get('/google/callback',passport.authenticate('google',{
  failureRedirect: '/'
}),(req,res)=> {
  res.redirect('/dashboard');
} );

router.get('/verify', (req,res) =>{      // auth/verify
  if(req.user)
  {
    console.log(req.user) // server restarts we are logged out so be prepared
  }
  else
  {
    console.log('not auth')
  }
});

router.get('/logout', (req,res) =>{      // auth/logout
  req.logOut();
  res.redirect('/');
});

module.exports = router;