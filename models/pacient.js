const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const pacientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        maxLength: 2
    },
    role: {
        type: Number,
        required: true,
        default: 3
    }

})



pacientSchema.pre('save', function (next) {
    if (this.isNew || this.isModified) {
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




module.exports = mongoose.model('Pacient', pacientSchema)



