const express           = require("express");
const router            = express.Router({mergeParams: true});
const Campground        = require("../models/campground");
const Comment           = require("../models/comment");
const middleware = require("../middleware");

// Comments NEW
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});

//Comments CREATE

router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               // add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Comment successfully added.");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//EDIT - comment

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req,res) => {
   Comment.findById(req.params.comment_id, (err, foundComment) =>{
       if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
   }
    
});
});

//Update - comment

router.put("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
       if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
   }
    
});
});

//Delete - comment

router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;