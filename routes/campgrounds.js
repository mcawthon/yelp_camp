var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

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
    };
    var newCampground = {name: name, image: image, cost: cost, description: desc, author: author};
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
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
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