const numero = "(32) 99925-1106"
const numero2 = "2312415125"
const data1 = '21/04/2010'
const time = '22:00'


const regexPattern =  /\((\d{2})\)\s(\d{5})[-]{1}(\d{4})/
const result = regexPattern.test(numero)
const result2 = regexPattern.test(numero2)
console.log(result)
console.log(result2)

const regexDate = /[0-3][0-9]\/[0-1][0-9]\/\d{4}/
const result3 = regexDate.test(data1)
console.log(result3)

const regexTime = /[0-2][0-9]:[0-5][0-9]/
const result4 = regexDate.test(data1)
console.log(result4)


// /ab*c/: o * depois de "b" significa "0 ou mais ocorrências do item precedente (anterior)." 
// Na string "cbbabbbbcdebc", esse padrão corresponderá à substring "abbbbc".

// \( e \): Captura os parênteses literais ao redor do código de área.
