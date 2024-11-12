const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { readdirSync } = require('fs')
const app = express()

// const authRouter = require('./routes/auth')
// const categoryRouter = require('./routes/category')
const PORT = 8000

// midleware
app.use(morgan('dev'))
app.use(express.json({limit:'20mb'}))  //ทำให้อ่านข้อมูล json ได้
app.use(cors())
// app.use('/api', authRouter)
// app.use('/api', categoryRouter)
readdirSync('./routes').map((item) =>
    app.use('/api', require('./routes/' + item))
)

// Router

app.listen(PORT, (req, res) => {
    console.log('server start at port', PORT)
})