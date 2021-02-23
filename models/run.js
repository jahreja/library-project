const mongoose = require("mongoose")
const path = require("path")
const coverImageBasePath = "uploads/runCovers"

const runSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    distance: {
        type: Number,
        required: true
    },
    runType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Location"
    }
})

runSchema.virtual("coverImagePath").get(function() {
    if (this.coverImageName != null) {
        return path.join("/", coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model("Run", runSchema)
module.exports.coverImageBasePath = coverImageBasePath