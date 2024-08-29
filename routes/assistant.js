const express = require('express')
const router = express.Router()

const Assistant = require('../models/assistant.js')
const Pacient = require('../models/pacient.js')
const Doctor = require('../models/doctor.js')
const Consultation = require('../models/consultation.js')

const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { verifyToken, verifyAssistant, verifyPhone, verifyPassword, verifyConsult } = require('../middleware/auth.js')
require('dotenv').config()
const bcrypt = require('bcrypt')

const secret = process.env.JWT_TOKEN

router.use(cookieParser())



router.post('/register', verifyPhone, verifyPassword, async (req, res) => {
    const { name, email, password, phone_number, age } = req.body

    if (!name || !email || !password || !phone_number || !age) {
        return res.status(422).json({ error: 'Você não preencheu as credenciais corretamente!' })
    }

    const phone_exists = await Assistant.findOne({ phone_number })
  
    if (phone_exists) {
        return res.status(409).json({ error: 'Este número já existe!' })
    }
    
    const user = await Assistant.findOne({ email })
    if (user) {
        return res.status(409).json({ error: 'Este usuário já existe!' })
    }

    if (password.trim().length < 8) {
        return res.status(422).json({ error: 'Não é permitido senha menor que 8 caracteres!' })
    }

    try {
        const newUser = await new Assistant({ name, email, password, phone_number, age })
        await newUser.save()
        return res.status(201).json({ message: 'Seu perfil de Assistente foi criado com sucesso!' })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Ocorreu um erro interno do servidor!' })
    }

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).json({ error: 'Você não preencheu as credenciais corretamente!' })
    }

    try {

        const user = await Assistant.findOne({ email })
        if (!user) {
            return res.status(422).json({ error: 'Este usuário não existe!' })
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(error)
                res.status(500).json({ error: 'Ocorreu mu erro ao descriptografar sua senha!' })
            }

            if (result == 0) {
                res.status(500).json({ error: 'Ocorreu mu erro ao descriptografar sua senha!' })
            }
            const token = jwt.sign({ userID: user._id, userRole: user.role }, secret, { expiresIn: '1h' })
            return res.cookie('cookieAuth', token, { maxAge: 30 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).status(201).json({ message: 'Logado com sucesso!', token: token })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Ocorreu algum erro interno no servidor' })

    }




})

router.delete('/logout', verifyToken, verifyAssistant, async (req, res) => {
    try {
        const cookie = req.cookies.cookieAuth

        if (!cookie) {
            return res.status(401).json({ message: "Você precisa logar." })
        }
        return res.cookie('cookieAuth', '', { expires: new Date(0), httpOnly: true, sameSite: 'strict' }).status(200).json({ message: "Usuário deslogado com sucesso!" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ocorreu algum erro inesperado!" })
    }
})

router.post('/pacient', verifyToken, verifyAssistant, verifyPhone, verifyPassword, async (req, res) => {

    try {


        const { name, email, password, phone_number, age } = req.body


        const phone_exists = await Pacient.findOne({ phone_number })
  
        if (phone_exists) {
            return res.status(409).json({ error: 'Este número já existe!' })
        }

        if (!name || !email || !password || !phone_number || !age) {
            return res.status(422).json({ error: 'Você não preencheu as credenciais corretamente!' })
        }

        const user = await Pacient.findOne({ email }) // chave e valor são iguais, por isso não precisa repetir
        console.log(user)
        if (user) {
            return res.status(409).json({ error: 'Já existe este paciente!' })

        }
        const newPacient = await new Pacient({ name, email, password, phone_number, age })
        await newPacient.save()
        return res.status(201).json({ message: 'Paciente criado com sucesso', newPacient })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Ocorreu um erro interno no servidor' })
    }



})

router.post('/doctor', verifyToken, verifyAssistant, async (req, res) => {
    try {
        const { name, email, password, age, medical_specialty, phone_number, start_time, end_time } = req.body
        console.log({ name, email, password, age, medical_specialty, phone_number, start_time, end_time })
        if (!name || !email || !password || !age || !medical_specialty || !phone_number || !start_time || !end_time) {
            return res.status(422).json({ error: 'Você não preencheu as credenciais corretamente!' })
        }

        const newDoctor = await new Doctor({ name, email, password, age, medical_specialty, phone_number, start_time, end_time })
        await newDoctor.save()
        return res.status(201).json({ message: 'Perfil médico criado com sucesso!' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Erro interno do servidor' })

    }
})




router.post('/consultation', verifyToken, verifyAssistant, verifyConsult, async (req, res) => {
    try {
        const { doctor_id, scheduled_date, scheduled_time, pacient_id, status } = req.body


        // VALIDAÇÃO DE ID'S
        if (!doctor_id) {
            return res.status(422).json({ error: 'Ocorreu um erro ao pegar o ID do doutor!' })
        }
        if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
            return res.status(422).json({ error: 'O id do doutor não é válido!' })
        }
        if (!mongoose.Types.ObjectId.isValid(pacient_id)) {
            return res.status(422).json({ error: 'O id do paciente não é válido!' })
        }

        const doctor = await Doctor.findById(doctor_id)
        const pacient = await Pacient.findById(pacient_id)

        if (!(doctor) || !(pacient)) {
            return res.status(422).json({ error: 'O id do paciente e/ou o do doutor não existe!' })
        }

        if (!scheduled_date || !scheduled_time || !pacient_id || !status) {
            return res.status(422).json({ error: 'Você não preencheu os campos corretamente!' })
        }

        const newConsultation = new Consultation({ doctor_id, scheduled_date, scheduled_time, pacient_id, status })
        newConsultation.save()

        return res.status(201).json({ message: "A consulta foi criada com sucesso!" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Ocoreu um erro interno no servidor!" })
    }

})

router.get('/consultation', verifyToken, verifyAssistant, async (req, res) => {
    try {
        const consultations = await Consultation.find()
        return res.status(200).json({ meessage: "Confira abaixo as consultas marcadas: ", consultations: consultations })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Ocorreu algum erro interno no servidor!" })
    }
})

router.delete('/consultation', verifyToken, verifyAssistant, async (req, res) => {
    try {
        const { id } = req.body


        // VALIDAÇÃO DE ID'S
        if (!id) {
            return res.status(422).json({ error: 'Ocorreu um erro ao pegar o ID da consulta!' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ error: 'O id da consulta não é válido!' })
        }

        const consultation = await Consultation.findById(id)

        if (!(consultation)) {
            return res.status(422).json({ error: 'A consulta não existe!' })
        }

        await consultation.deleteOne()
        return res.status(201).json({ message: "A consulta foi deletada com sucesso!" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Ocoreu um erro interno no servidor!" })
    }

})

router.patch('/consultation', verifyToken, verifyAssistant, verifyConsult, async (req, res) => {
    try {
        const { id, ...info } = req.body

        if (!id) {
            return res.status(422).json({ error: 'Ocorreu um erro ao pegar o ID da consulta!' })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ error: 'O id da consulta não é válido!' })
        }

        const consultation = await Consultation.findById(id)

        if (!consultation) {
            return res.status(400).json({ error: 'Este ID da consulta não existe' })
        }

        if (!info) {
            return res.status(422).json({ error: 'Você esqueceu de preencher as alterações' })
        }

        Object.assign(consultation, info)
        await consultation.save()

        return res.status(200).json({ message: "Consulta modificada com sucesso!", consultation: consultation })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ocorreu um erro interno no servidor!" })
    }

})












module.exports = router