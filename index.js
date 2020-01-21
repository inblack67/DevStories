const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const cookiParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');


// load user model  (register)
require('./models/User');

// passport config
require('./config/passport')(passport);


// load routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// get keys
const keys = require('./config/keys');

const app = express();


// mapping global mongo
mongoose.Promise = global.Promise;

// mong connection
mongoose.connect(keys.mongoURI,{
// useMongoClient: true -> depricated
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => console.log('Mongo is here'))
.catch((err) => console.log(err))
;

// handlebars middleware
app.engine('handlebars',exphbs({
  defaultLayout: 'main'
}));
app.set('view engine','handlebars');

app.use(cookiParser());
app.use(session({
  secret: 'secret',
  resave: 'false',
  saveUninitialized: false
}));

// passport middleware
app.use(passport.initialize());
app.use((passport.session()));
// ps needs express session to run correctly


// global variables
app.use((req,res,next) => {

  res.locals.user = req.user || null;
  next();

});

// use routes
app.use('/auth',auth);
app.use('/',index);

const port = process.env.PORT || 5000;

app.listen(port, () => {
console.log(`Server started on port ${port}`);
});