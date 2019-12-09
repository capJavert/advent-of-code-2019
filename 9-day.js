require('es6-promise').polyfill()
require('isomorphic-fetch')

const { computer } = require('./intcode')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/zkGKwFfb').then(response => response.text())
    // const data = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'
    const input = data.split(',').map(code => +code).reduce((acc, code, index) => {
        acc[index] = code

        return acc
    }, {})

    computer(input, 0, () => 2, (output) => {
        console.log('output', output)
    })

    console.log()
}

main()
