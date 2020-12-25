const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//INDEX - Show all Campgrounds
router.get('/', function (req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('./campgrounds/index', {
        campground: allCampgrounds,
        page: 'campgrounds',
      });
    }
  });
  //;
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function (req, res) {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author,
  };

  //Create a new campground and save to DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated.json);
      res.redirect('/campgrounds');
    }
  });
});

//NEW - Show form to create new campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
  // get data from form and add to campgrounds array
  res.render('./campgrounds/new');
});

//SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
  // find campground with provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found.');
        res.redirect('back');
      } else {
        //render show template with that campground
        res.render('./campgrounds/show', { campground: foundCampground });
      }
    });
});

//EDIT - show form to edit campgound
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found.');
      res.redirect('back');
    } else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  });
});

//UPDATE - updates campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        res.redirect('/campgrounds');
      } else {
        res.redirect('/campgrounds/' + req.params.id);
      }
    }
  );
});

//DELETE - campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
