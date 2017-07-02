var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
var geocoder   = require("geocoder");

router.get("/", function(req, res) {
    Campground.find({}, function(err, allcampgrounds) {
        if (err)
        {
            console.log(err);
        }
        else 
        {
            res.render("./campgrounds/index", {campgrounds: allcampgrounds, page: 'campgrounds'});
        }
    });
});

router.post("/", middleware.isLoggedIn,function(req, res) {
    var name = req.body.name;
    var cost = req.body.cost;
    var image = req.body.image;
    var desc = req.body.description;
    var author = 
    {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function(err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image, cost: cost, description: desc, author: author, location: location, lat: lat, lng: lng};
        // create new campground & save to db
        Campground.create(newCampground, function(err, newlyCreated) 
        {
            if (err)
            {
                console.log(err);
            }
            else
            {
                 res.redirect("/campgrounds");
            }
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("./campgrounds/new");
});

router.get("/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if (err)
        {
            console.log(err);
        }
        else
        {
            //  console.log(foundCampground);
             res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err)
        {

        }
        res.render("campgrounds/edit", {campground: foundCampground}); 
    });
});

//update
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
            if(err)
            {
                req.flash("error", err.message);
                res.redirect("back");
            } 
            else 
            {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
            
        });
    });
});

//destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err)
        {
            res.redirect("/campgrounds");
        }
        else 
        {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;