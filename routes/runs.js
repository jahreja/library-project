const express = require("express")
const router = express.Router()

const Run = require("../models/run")
const Location = require("../models/location")

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]



// All Runs Route
router.get("/", async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== ""){
        searchOptions.title = new RegExp(req.query.title, "i")
    }
    try {
        const runs = await Run.find(searchOptions)
        res.render("runs/index", {
            runs: runs,
            searchOptions: req.query
        })
    } catch {
        res.redirect("/")
    }
    
})

//New runs Route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Run())
})

//Create runs route
router.post("/", async (req, res) => {
    const run = new Run({
        title: req.body.title,
        location: req.body.location,
        distance: req.body.distance,
        runType: req.body.runType,
        description: req.body.description
    })

    saveCover(run, req.body.cover)


    try {
        const newRun = await run.save()
        //res.redirect(`runs/${newRun.id}`)
        res.redirect(`runs`)
    } catch {
        renderNewPage(res, run, true)
    }
})


async function renderNewPage(res, run, hasError = false) {
    try {
        const locations = await Location.find({})
        const params = {
            locations: locations,
            run: run
        }
        if (hasError) params.errorMessage = "Error Creating Run"
        res.render("runs/new", params)
    } catch {
        res.redirect("/runs")
    }
}

function saveCover(run, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        run.coverImage = new Buffer.from(cover.data, "base64")
        run.coverImageType = cover.type
    }
}

module.exports = router