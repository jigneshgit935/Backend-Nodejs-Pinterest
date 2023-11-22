var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/feed', function (req, res, next) {
  res.render('feed');
});

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('profile');
});

router.post('/register', function (req, res, next) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({
    username,
    email,
    fullname,
  });

  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate('local')(req, res, () => {
      res.redirect('/profile');
    });
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function (req, res, next) {}
);

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
