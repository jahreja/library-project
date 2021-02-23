const express = require("express")
const router = express.Router()
const Run = require("../models/run")

router.get("/", async (req, res) => {
    let runs
    try {
        runs = await Run.find().sort({ createAt: "desc" }).limit(10).exec()
    } catch {
        runs = []
    }
    res.render("index", { runs: runs })
})

module.exports = router