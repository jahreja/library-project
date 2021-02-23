const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const Run = require("../models/run")
const Location = require("../models/location")
const uploadPath = path.join("public", Run.coverImageBasePath)

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

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
router.post("/", upload.single("cover"), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const run = new Run({
        title: req.body.title,
        location: req.body.location,
        distance: req.body.distance,
        runType: req.body.runType,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newRun = await run.save()
        //res.redirect(`runs/${newRun.id}`)
        res.redirect(`runs`)
    } catch {
        if (run.coverImageName != null){
            removeRunCover(run.coverImageName)
        }
        renderNewPage(res, run, true)
    }
})

function removeRunCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

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


module.exports = router