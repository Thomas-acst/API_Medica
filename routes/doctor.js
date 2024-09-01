const express = require('express')
const { verifyToken, verifyDoctor, login } = require('../middleware/auth')
const router = express.Router()

const Doctor = require('../models/doctor')
const Report = require('../models/report')
const Pacient = require('../models/pacient')
const Consultation = require('../models/consultation')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const mongoose = require('mongoose')

const secret = process.env.JWT_TOKEN

router.use(cookieParser())




router.post('/login', login(Doctor, secret), async (req, res) => {
    try {
        return res.status(200).json({ message: "Médico lgado com sucesso!" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Ocorreu algum erro interno no servidor' })

    }
})


router.delete('/logout', verifyToken, verifyDoctor, async (req, res) => {
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


router.post('/report', verifyToken, verifyDoctor, async (req, res) => {
    // VERIFICAR SE O ID EXSITE
    try {
        const doctor_id = req.userID
        console.log(doctor_id)

        if (!doctor_id) {
            return res.status(422).json({ error: 'Ocorreu um erro ao pegar o ID do doutor!' })
        }

        const { pacient_id, time, symptoms, medicines, requested_exams, observations } = req.body
        console.log(req.body)

        const pacient = await Pacient.findById(pacient_id)
        // Se fizer uma procura sem ser por ID, retorna um array de documentos e um array vazio será considerado como verdadeiro

        if (!mongoose.Types.ObjectId.isValid(pacient_id)) {
            return res.status(422).json({ error: 'O id do paciente não é válido!' })
        }

        if (!(pacient)) {
            return res.status(422).json({ error: 'O id do paciente não existe!' })
        }

        if (!pacient_id || !time || !symptoms) {
            return res.status(422).json({ error: 'Você não preencheu os campos corretamente!' })
        }

        const report = new Report({ doctor_id, pacient_id, time, symptoms, medicines, requested_exams, observations })

        await report.save()
        return res.status(201).json({ message: "Relatório criado!" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Ocorreu algum erro interno no servidor' })
    }

})


router.get('/report/:id', verifyToken, verifyDoctor, async (req, res) => {
    try {

        const { id } = req.params
        console.log({ id })


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ error: 'O id do paciente não é válido!' })
        }
        const pacient = await Pacient.findById(id)

        if (!(pacient)) {
            return res.status(422).json({ error: 'O id do paciente não existe!' })
        }

        const report = await Report.find({ pacient_id: id })
        res.status(200).json({ report })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ocorreu um erro interno no servidor!" })
    }

})


router.get('/consultation', verifyToken, verifyDoctor, async (req, res) => {
    const consultations = await Consultation.find()
    return res.status(200).json({ message: "Confira as consultas abaixo:", consultations: consultations })
})

























module.exports = router