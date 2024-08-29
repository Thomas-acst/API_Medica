const mongoose = require('mongoose')

const consultationSchema = new mongoose.Schema({

    scheduled_date: {
        type: String,
        required: true
    },
    
    scheduled_time: {
        type: String,
        required: true
    },

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
    status: {
        type: String,
        enum: ['agendada', 'concluída'],
        required: true
    },



})


module.exports = mongoose.model('Consultation', consultationSchema)