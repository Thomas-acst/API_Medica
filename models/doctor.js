const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    medical_specialty: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 2
    }

})




doctorSchema.pre('save', function (next) {
    if (this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                res.status(500).json({ error: "Ocorreu um erro ao criptografar sua senha" })
                return next(err)
            }
            bcrypt.hash(this.password, salt, (err, hashedPassword) => {
                if (err) {
                    res.status(500).json({ error: "Ocorreu um erro ao criptografar sua senha" })
                    return next(err)
                }
                this.password = hashedPassword
                next()
            })
        })
    } else {
        next()
    }
})




module.exports = mongoose.model('doctor', doctorSchema)