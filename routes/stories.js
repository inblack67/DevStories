const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// index
router.get('/' ,(req,res) => {    // we are in stories so / = stories/...
  res.render('stories/index');
});

// add form
router.get('/add' , ensureAuthenticated,(req,res) => {
  res.render('stories/add');
});


module.exports = router;