// const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.JWT_TOKEN


function verifyToken(req, res, next) {
    const token = req.cookies.cookieAuth

    if (!token) {
        res.status(407).json({ error: 'Você esqueceu de logar no sistema' })
    }

    jwt.verify(token, secret, function (err, decodedToken) {
        if (err) {
            console.log(err)
            res.status(500).json({ error: 'Erro ao decodificar seu token!' })
        }

        req.userID = decodedToken.userID
        req.userRole = decodedToken.userRole
        console.log('decodedToken.userID --> ' + req.userID)
        console.log('decodedToken.userRole --> ' + req.userRole)
        next()

    })
}


function verifyAssistent(req, res, next) {
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









module.exports = { verifyToken, verifyAssistent, verifyDoctor }