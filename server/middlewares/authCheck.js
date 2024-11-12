const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')


exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization
        if (!headerToken) {
            return res.status(401).json({ message: "No Token , Authorization" })
        }

        const Token = headerToken.split(' ')[1]
        const checkToken = jwt.verify(Token, process.env.SECRET, { algorithms: ['HS256'] })
        req.user = checkToken //ใช้เป็น req.user เพราะเพื่อให้สามารถนำไปใช้ใน api หรือ routes ถัดไปได้

        const user = await prisma.user.findFirst({
            where: {
                email: req.user.email
            }
        })

        if (!user.enabled) {
            return res.status(400).json({
                message: 'This account cannot access'
            })
        }
        console.log(user)
        console.log('Middleware')
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Token Invalid'
        })
    }
}

exports.adminCheck = async (req, res, next) => {
    try {
        const { email } = req.user
        const adminUser = await prisma.user.findFirst({
            where: { email: email }
        })

        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({
                message: 'Acess Denied: Admin Only'
            })
        }
        // console.log('Adminncheck', adminUser)
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error Admin access denied'
        })
    }
}