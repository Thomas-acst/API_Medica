const myPromise2 = new Promise((resolve, reject) => {
    const nome = 'Creitu'

    if (nome === 'Cleitu'){
        resolve('Usuário encontrado')
    }
    reject('Usuário não encontrado')

})


myPromise2.then((data) => {
    return data.toLowerCase()
}).then((stringModificada) => {
    return console.log(stringModificada)
}).catch((err) => {
    return console.error('Aconteceu um erro --> ' + err)
})

