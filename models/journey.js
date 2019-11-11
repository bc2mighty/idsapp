const mongoose = require("mongoose")

const journeySchema = new mongoose.Schema({
    sample: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Sample"
    },
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    temperature: {
        type: String,
        required: true
    },
    rotation: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Journey", journeySchema)
