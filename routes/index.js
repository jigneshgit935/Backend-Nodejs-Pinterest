var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');

const upload = require('./multer');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/feed', function (req, res, next) {
  res.render('feed');
});

router.post(
  '/upload',
  isLoggedIn,
  upload.single('file'),
  async function (req, res) {
    if (!req.file) {
      return res.status(400).send('No files were uploaded');
    }
    res.send('File uploaded successfully');

    const user = await userModel.findOne({
      username: req.session.passport.user,
    });

    const post = await postModel.create({
      image: req.file.filename,
      imageText: req.body.filecaption,
      user: user._id,
    });

    await user.posts.push(post._id);
    res.send('done');
  }
);

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('profile', { user });
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
