const mongoose = require("mongoose")
const Run = require("./run")

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

locationSchema.pre("remove", function(next){
    Run.find({ location: this.id }, (err, runs) => {
        if (err) {
            next(err)
        } else if (runs.length > 0) {
            next(new Error("This location has runs assigned!"))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model("Location", locationSchema)