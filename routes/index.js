const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//root route

router.get('/', function (req, res) {
  res.render('landing');
});

// show register form

router.get('/register', function (req, res) {
  res.render('register', { page: 'register' });
});

//handle sign up logic
router.post('/register', function (req, res) {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to Yelpcamp ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

// show login form

router.get('/login', function (req, res) {
  res.render('login', { page: 'login' });
});

// handle login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function (req, res) {
    const user = req.body.user;
    res.send(user.json);
  }
);

// logout route

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/campgrounds');
});

module.exports = router;
