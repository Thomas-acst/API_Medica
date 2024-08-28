const express = require('express')
const cookieParser = require('cookie-parser')
const assistentRoutes = require('./routes/assistente.js')
const pacientRoutes = require('./routes/pacient.js')
const doctorRoutes = require('./routes/doctor.js')
const app = express()
require('./config/database.js')

app.use(express.json())


app.use(cookieParser());


app.use('/assistent', assistentRoutes)
app.use('/pacient', pacientRoutes)
app.use('/doctor', doctorRoutes)









const port = 3000
app.listen(port, () => console.log(`Servidor rodando --> http://localhost:${port}`))