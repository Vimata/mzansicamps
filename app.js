const express           =require("express");
const bodyParser        = require("body-parser");
const app               = express();
const mongoose          = require("mongoose");
const passport          = require("passport");
const LocalStrategy     = require("passport-local");
const methodOverride    = require("method-override");
const flash             = require("connect-flash");
const helmet            = require('helmet');

const User              = require("./models/user");
const seedDB            = require("./seeds");

const commentRoutes     = require("./routes/comments");
const campgroundRoutes  = require("./routes/campgrounds");
const indexRoutes        = require("./routes/index");

app.use(helmet());

const uri = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';

mongoose.connect(uri, { useNewUrlParser: true }, (err) =>{
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to ' + uri);
    }
    
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "My name is Gandolf",
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// user available to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// require routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Has Started");
});



