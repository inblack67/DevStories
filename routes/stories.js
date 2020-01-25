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
.populate('user')  
.sort({date:'desc'})     // populate with all the field from the user
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
.populate('comments.commentUser')
.then(story =>{

  if(story.status == 'public')
  {
    res.render('stories/show',{
      story: story
      });
  }
  else
  {
    if(req.user)
    {
      if(req.user.id == story.user._id)
      {
        res.render('stories/show',{
          story: story
          });
      }
      else
      {
        res.redirect('/stories');
      }
    }
    else
    {
      res.redirect('/stories');
    }
  }

})
;
});


// list stories from a user
router.get('/user/:userId', (req,res) => {
  Story.find({
    user: req.params.userId,
    status: 'public'
  })
  .populate('user')
  .then(stories => {
    res.render('stories/index',{
      stories
    });
  })
  ;
});

// my stories
router.get('/my', ensureAuthenticated, (req,res) => {
  Story.find({
    user: req.user.id
  })
  .populate('user')
  .then(stories => {
    res.render('stories/index',{
      stories
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

  if(story.user != req.user.id)
  {
    res.redirect('/stories');
  }

  else
  {
    res.render('stories/edit',{
      story: story
      });
  }

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


// comments
router.post('/comment/:id', (req,res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }

    // adding by latest (unshift -> beginning)
    story.comments.unshift(newComment);

    story.save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    })
    ;
  })
  ;
});



module.exports = router;