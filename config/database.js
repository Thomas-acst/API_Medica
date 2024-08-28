const mongoose = require('mongoose')


const nomeDB = 'API_Medica'

async function connect(){
    mongoose.connect(`mongodb://localhost/${nomeDB}`)
    .then(console.log(`Tudo certo na conexão com o banco de dados ${nomeDB}`))
    .catch((err) => console.log('Houve um erro na conexão com o banco de dados!'))
}

connect()