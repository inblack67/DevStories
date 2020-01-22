module.exports = {
  ensureAuthenticated: (req,res,next) =>
  {
    if(req.isAuthenticated())
    {
      return next();
    }
    else
    {
      res.redirect('/');
    }
  },

  ensureGuest: (req,res,next) =>
  {
    if(req.isAuthenticated())
    {
      res.redirect('/dashboard');
    }
    else
    {
      return next();
    }
  }
}