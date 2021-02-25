const express = require("express")
const router = express.Router()

const Run = require("../models/run")
const Location = require("../models/location")

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]



// All Runs Route
router.get("/", async (req, res) => {
    let searchOptions = {}
    if (req.query.location != null && req.query.location !== ""){
        searchOptions.location = new RegExp(req.query.location, "i")
    }
    try {
        const runs = await Run.find(searchOptions)
        res.render("runs/index", {
            runs: runs,
            searchOptions: req.query
        })
    } catch (err){
        console.log(err)
        res.redirect("/")
    }
    
})

// New Run Route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Run())
})

// Create Run route
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
        res.redirect(`runs/${newRun.id}`)
    } catch {
        renderNewPage(res, run, true)
    }
})

// Show Run Route
router.get("/:id", async (req, res) => {
    try {
        const run = await Run.findById(req.params.id).populate("location").exec()
        res.render("runs/show", { run: run })
    } catch {
        res.redirect("/")
    }
})

// Edit Run Route
router.get("/:id/edit", async (req, res) => {
    try {
        const run = await Run.findById(req.params.id)
        renderEditPage(res, run)
    } catch {
        res.redirect("/")
    }

})

// Update Run Route
router.put("/:id", async (req, res) => {
    let run
    try {
        run = await Run.findById(req.params.id)
        run.title = req.body.title
        run.location = req.body.location
        run.distance = req.body.distance
        run.runType = req.body.runType
        run.description = req.body.description
        if (req.body.cover != null && req.body.cover != ""){
            saveCover(run, req.body.cover)
        }
        await run.save()
        res.redirect(`/runs/${run.id}`)
    } catch {
        if (run != null){
            renderEditPage(res, run, true)
        } else {
            redirect("/")
        }
    }
})

// Delete Run Route
router.delete("/:id", async (req, res) => {
    let run 
    try {
        run = await Run.findById(req.params.id)
        await run.remove()
        res.redirect("/runs")
    } catch {
        if (run != null){
            res.render("runs/show", {
                run: run,
                errorMessage: "Could not remove run."
            })
        } else {
            res.redirect("/")
        }
    }
})


// Render Functions, to reduce repeated code

async function renderNewPage(res, run, hasError = false) {
    renderFormPage(res, run, "new", hasError)
}

async function renderEditPage(res, run, hasError = false) {
    renderFormPage(res, run, "edit", hasError)
}

async function renderFormPage(res, run, form, hasError = false) {
    try {
        const locations = await Location.find({})
        const params = {
            locations: locations,
            run: run
        }
        if (hasError){
            if(form === "edit"){
                if (hasError) params.errorMessage = "Error Editing Run"
            } else {
                if (hasError) params.errorMessage = "Error Creating Run"
            }
        }
        res.render(`runs/${form}`, params)
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