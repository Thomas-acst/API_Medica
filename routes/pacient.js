const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')

const router = express.Router()
require('dotenv').config()
const { verifyToken, verifyPacient, verifyPhone, verifyPassword } = require('../middleware/auth.js')

const cookieParser = require('cookie-parser')
const Pacient = require('../models/pacient.js')
router.use(cookieParser())

const secret = process.env.JWT_TOKEN



router.post('/register', verifyPhone, verifyPassword, async (req, res) => {
    const { name, email, password, phone_number, age } = req.body

    if (!name || !email || !password || !phone_number || !age) {
        return res.status(422).json({ error: 'Você não preencheu as credenciais corretamente!' })
    }
    const user = await Pacient.findOne({ email })
    const phone_exists = await Pacient.findOne({phone_number})

    if (user) {
        return res.status(409).json({ error: 'Este usuário já existe!' })
    }

    if(phone_exists){
        return res.status(409).json({ error: 'Este número já existe!' })
    }

    try {
        const newUser = await new Pacient({ name, email, password, phone_number, age })
        await newUser.save()
        return res.status(201).json({ message: 'Seu perfil foi criado com sucesso!' })

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

    const user = await Pacient.findOne({ email })
    if (!user) {
        return res.status(409).json({ error: 'Este usuário não existe!' })
    }

    try {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ error: 'Ocorreu mu erro ao descriptografar sua senha!' })
            }

            if (result == 0) {
                return res.status(500).json({ error: 'Ocorreu mu erro ao descriptografar sua senha!' })
            }

            const token = jwt.sign({ userID: user._id, userRole: user.role }, secret, { expiresIn: '1h' })
            return res.cookie('cookieAuth', token, { maxAge: 30 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).status(201).json({ message: 'Logado com sucesso!', token: token, user:user })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Ocorreu algum erro interno no servidor' })
    }
})



router.get('/', verifyToken, verifyPacient,  async (req, res) => {
    const id = req.userID
    const user = await Pacient.findOne({ _id: id })

    if (id == user._id) {
        return res.status(200).json({ user })
    }

    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor' })

})


router.patch('/', verifyToken, verifyPacient,  async (req, res) => {
    try {
        const { id, ...info } = req.body 

        const user = await Pacient.findOne({ _id: id })
        
        if (req.userID != id) {
            console.log(req.userID)
            console.log(id)
            return res.status(401).json({ error: 'Você não tem autorização para alterar estes dados' })
        }

        if (!user) {
            return res.status(400).json({ error: 'Este usuário não existe' })
        }

        Object.assign(user, info) // o user já foi sobrescrito com as novas informações

        await user.save()
        return res.status(200).json({ message: 'Usuário alterado com sucesso', user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ocorreu um erro interno no servidor!" })

    }

})


router.delete('/logout', verifyToken, verifyPacient, async (req, res) => {
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
















module.exports = router