const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Consultation = require('../models/consultation')

const secret = process.env.JWT_TOKEN


function verifyToken(req, res, next) {
    const token = req.cookies.cookieAuth

    if (!token) {
        return res.status(407).json({ error: 'Você esqueceu de logar no sistema' })
    }

    jwt.verify(token, secret, function (err, decodedToken) {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Erro ao decodificar seu token!' })
        }

        req.userID = decodedToken.userID
        req.userRole = decodedToken.userRole
        return next()

    })
}


function verifyAssistant(req, res, next) {
    if (req.userRole === 1) {
        return next()
    }
    return res.status(401).json({ message: 'Você não tem autorização para fazer esta ação' })

}


function verifyDoctor(req, res, next) {
    if (req.userRole === 2) {
        return next()
    }
    return res.status(401).json({ message: 'Você não tem autorização para fazer esta ação' })

}


function verifyPacient(req, res, next) {
    if (req.userRole === 3) {
        return next()
    }
    return res.status(401).json({ message: 'Você não tem autorização para fazer esta ação' })

}


function verifyPhone(req, res, next) {
    const phone_number = req.body.phone_number

    console.log('Número colocado --> ' + phone_number)
    const regexPattern = /\((\d{2})\)\s(\d{5})[-]{1}(\d{4})/
    const result = regexPattern.test(phone_number)
    console.log('Resultado --> ' + result)

    if (result == true) {
        return next()
    }
    return res.status(422).json({ error: "Você digitou um número inválido, o padrão deve ser (XX) XXXXX-XXXX" })


}


function verifyPassword(req, res, next) {
    try {
        const password = req.body.password
        if (!password) {
            return res.status(422).json({ error: 'Você não digitou uma senha' })
        }

        if (password.trim().length < 8) {
            return res.status(422).json({ error: 'Não é permitido senha menor que 8 caracteres!' })
        }

        return next()

    } catch (error) {
        res.status(500).json('Ocorreu um erro interno no sevidor')
    }

}


async function verifyConsult(req, res, next) {
    try {
        const { scheduled_date, scheduled_time } = req.body

        const consultation_conflict_date = await Consultation.findOne({ scheduled_date })
        const consultation_conflict_time = await Consultation.findOne({ scheduled_time })

        if (consultation_conflict_time) {
            return res.status(409).json({ error: "Já existe uma consulta para esta hora" })
        }

        const regexDate = /[0-3][0-9]\/[0-1][0-9]\/\d{4}/
        const regexTime = /[0-2][0-9]:[0-5][0-9]/

        const resultDate = regexDate.test(scheduled_date)

        const resultTime = regexTime.test(scheduled_time)

        if (resultDate == true || resultTime == true) {
            return next()
        }
        return res.status(422).json({ error: "Você digitou uma data ou hora inválida, o padrão deve ser XX-XX-XXXX para datas e XX:XX para horas" })
        
    
    


    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Ocorreu um erro interno no servidor" })
    }
}


const login = (dbModel, secret) => {
    return async(req, res, next) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(422).json({ error: 'Você não preencheu as credenciais corretamente!' })
        }

        const user = await dbModel.findOne({ email })
        if (!user) {
            return res.status(422).json({ error: 'Este usuário não existe!' })
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(error)
                return res.status(500).json({ error: 'Ocorreu um erro ao descriptografar sua senha!' })
            }

            if (result == 0) {
                return res.status(422).json({ error: 'Você digitou a senha errada!' })
            }

            const token = jwt.sign({ userID: user._id, userRole: user.role }, secret, { expiresIn: '1h' })
            res.cookie('cookieAuth', token, { maxAge: 30 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            return next()
        })
    }
} 



module.exports = { verifyToken, verifyAssistant, verifyDoctor, verifyPacient, verifyPhone, verifyPassword, verifyConsult, login }