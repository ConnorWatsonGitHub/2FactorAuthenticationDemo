var express = require('express');
var router = express.Router();
// importing for Authentication
const User = require('../models/user');
const passport = require('passport');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: '2 Factor Authentication',
    user: req.user
  });
});

/*

STEP 1:
DESCRIPTION

*/




// Middleware function to check if the current user is logged in.
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


//ROUTES FOR LOGIN SUCCESS PAGE
router.get('/loginSuccess', IsLoggedIn, function (req, res, next) {
  res.render('loginSuccess', {
    title: 'Login Successful',
    user: req.user
  });
});
// ROUTES FOR LOGIN ---------------------------------|
// GET
router.get('/login', (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', {
    title: 'Login',
    messages: messages,
    user: req.user
  });
});

// POST
router.post('/login', passport.authenticate('local', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}));


// ROUTES FOR REGISTER -----------------------------|
// GET
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register',
    user: req.user
  });
});

// POST
router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect('/register');
      } else {
        req.login(newUser, (err) => {
          res.redirect('/loginSuccess');
        });
      }
    }
  );
});

// ROUTES FOR LOGOUT
// GET
router.get('/logout', (req, res, next) => {
  // log user out
  req.logOut();
  // send user back to login page
  res.redirect('/login');
});



module.exports = router;