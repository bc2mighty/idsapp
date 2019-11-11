const mongoose = require("mongoose")

const sampleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Hospital"
    },
    arrivingHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Patient"
    },
    lab_attendant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Lab_attendant"
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Sample", sampleSchema)
