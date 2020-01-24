const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// index
router.get('/' ,(req,res) => {    // we are in stories so / = stories/...
Story.find({
status: 'public'
})
.populate('user')       // populate with all the field from the user
.then(stories => {
res.render('stories/index',{
stories: stories      // returning stories all of them
});
})
;
});

// show single stories
router.get('/show/:id', (req,res) => {
Story.findOne({
_id: req.params.id
})
.populate('user')
.then(story =>{
res.render('stories/show',{
story: story
});
})
;
});

// add form
router.get('/add' , ensureAuthenticated,(req,res) => {
res.render('stories/add');
});

// edit form
router.get('/edit/:id' , ensureAuthenticated,(req,res) => {

Story.findOne({
_id: req.params.id
})
.then(story =>{
res.render('stories/edit',{
story: story
});
})
;

});

// add story
router.post('/', (req,res) => {     // /stories
let allowComments;
if(req.body.allowComments)
{
allowComments = true;
}
else
{
allowComments = false; 
}

const newStory = {
title: req.body.title,
body: req.body.body,
status: req.body.status,
allowComments: allowComments,
user: req.user.id
}

// story
new Story(newStory).save()
.then(story => {
res.redirect(`/stories/show/${story.id}`);
})

});

// editing form
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComments;
    
    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
      .then(story => {
        res.redirect('/dashboard');
      });
  });
});

// deleting
router.delete('/:id', (req, res) => {
  Story.remove({
    _id: req.params.id
  })
  .then(() => {
    res.redirect('/dashboard');
  })
  ;
});



module.exports = router;