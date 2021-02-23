const express = require("express")
const router = express.Router()
const Location = require("../models/location")

// All locations Route
router.get("/", async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ""){
        searchOptions.name = new RegExp(req.query.name, "i")
    }
    try {
        const locations = await Location.find(searchOptions)
        res.render("locations/index", {
            locations: locations,
            searchOptions: req.query
        })
    } catch {
        res.redirect("/")
    }
    
})

//New locations Route
router.get("/new", (req, res) => {
    res.render("locations/new", { location: new Location() })
})

//Create locations route
router.post("/", async (req, res) => {
    const location = new Location({
        name: req.body.name
    })
    try {
        const newLocation = await location.save()
        //res.redirect(`locations/${newLocation.id}`)
        res.redirect("locations")
    } catch {
        res.render("locations/new", {
            location: location,
            errorMessage: "Error creating Location"
        })
    }
})

module.exports = router