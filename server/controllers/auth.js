const prisma = require('../config/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    try {

        const { email, password } = req.body
        // Step 1 Validate body
        if (!email) {
            return res.status(400).json({
                message: 'email not found!'
            })
        }
        if (!password) {
            return res.status(400).json({
                message: 'password not found!'
            })
        }

        // Step 2 Check in Database
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (user) {
            return res.status(400).json({
                message: "Email already exits"
            })
        }

        //Step 3 HashPassword
        const hashPassword = await bcrypt.hash(password, 10)


        //Step 4 Register in database
        await prisma.user.create({
            data: {
                email: email,
                password: hashPassword
            }
        })


        res.json({
            message: 'สมัครสมาชิกสำเร็จ'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error',
            error: error
        })
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        //Step 1 Check Email
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user || !user.enabled) {
            return res.status(400).json({
                message: 'User Not Found or not Enabled'
            })
        }
        //Step 2 Check password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: 'Password Wrong!'
            })
        }

        //Step 3 Create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        //Step 4 Generate Token
        jwt.sign(payload, process.env.SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    message: 'Server Error'
                })
            }
            res.json({ payload, token })
        })
        console.log(payload)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error',
            error: error
        })
    }
}

exports.currentUser = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: req.user.email
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error',
            error: error
        })
    }
}

// exports.currentAdmin = async (req, res) => {
//     try {
//         res.send('Hello Login In currentAdmin')
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: 'Server Error',
//             error: error
//         })
//     }
// }