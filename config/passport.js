const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const User = mongoose.model('users');

module.exports = (passport) => {
passport.use(
new GoogleStrategy({
clientID: keys.googleClientID,
clientSecret: keys.googleClientSecret,
callbackURL: '/auth/google/callback',
proxy: true // for heroku (https?)
},(accessToken, refreshToken, profile, done) => {
const image = profile.photos[0].value;

const newUser = {
googleID: profile.id, // profile that is coming in
firstName: profile.name.givenName,
lastName: profile.name.familyName,
email: profile.emails[0].value,
image: image
}



// check for existing user
User.findOne({    // mongoose meth
googleID: profile.id
})
.then((user) => {
if(user)
{
done(null, user);
}
else
{
// create user
new User(newUser).save()
.then(user => done(null,user))
;
}
})
;
})
);

passport.serializeUser((user,done) => {
done(null, user);
});
passport.deserializeUser((id,done) => {
User.findById(id)
.then(user => {
done(null,user);
})
;
})
}