var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var seedDB     = require("./seeds");
var flash      = require("connect-flash");

var Comment    = require("./models/comment.js");
var Campground = require("./models/campground.js");
var User = require("./models/user.js")

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

// seedDB();

//Passport config
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

// mongoose.connect("mongodb://localhost/yelp_camp_v3");
mongoose.connect("mongodb://mike:citizen@ds035846.mlab.com:35846/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server Started"); 
});