const express = require("express")
const router = express.Router()
const Location = require("../models/location")
const Run = require("../models/run")

// All Locations Route
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

//New Location Route
router.get("/new", (req, res) => {
    res.render("locations/new", { location: new Location() })
})

//Create Location Route
router.post("/", async (req, res) => {
    const location = new Location({
        name: req.body.name
    })
    try {
        const newLocation = await location.save()
        res.redirect(`locations/${newLocation.id}`)
    } catch {
        res.render("locations/new", {
            location: location,
            errorMessage: "Error creating Location"
        })
    }
})

// Show Location Route
router.get("/:id", async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
        const runs = await Run.find({ location: location.id }).limit(6).exec()
        res.render("locations/show", {
            location: location,
            runsInLocation: runs
        })
    } catch (err){
        console.log(err)
        res.redirect("/")
    }
})

// Edit Location Route
router.get("/:id/edit", async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
        res.render("locations/edit", { location: location })
    } catch {
        res.redirect("/locations")
    }
})

// Update Location Route
router.put("/:id", async (req, res) => {
    let location
    try {
        location = await Location.findById(req.params.id)
        location.name = req.body.name
        await location.save()
        res.redirect(`/locations/${location.id}`)
    } catch {
        if (location == null){
            res.redirect("/")
        } else {
            res.render("locations/edit", {
                location: location,
                errorMessage: "Error Updating Location"
            })
        }
    }
})

// Delete Location Route
router.delete("/:id", async (req, res) => {
    let location
    try {
        location = await Location.findById(req.params.id)
        await location.remove()
        res.redirect("/locations")
    } catch {
        if (location == null){
            res.redirect("/")
        } else {
            res.redirect(`/locations/${location.id}`)
        }
    }
})



module.exports = router