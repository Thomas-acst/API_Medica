const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({

    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },

    pacient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacient',
        required: true
    },

    date: {
        type: Date,
        default: Date.now,
        required: true
    },

    time: {
        type: String,
        required: true,
    },

    symptoms: {
        type: String,
        required: true,
    },

    medicines: {
        type: String
    },

    requested_exams: {
        type: String,
    },

    observations: {
        type: String,
    },



})


module.exports = mongoose.model('Report', reportSchema)