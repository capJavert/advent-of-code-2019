require('es6-promise').polyfill()
require('isomorphic-fetch')

const { computer } = require('./intcode')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/A1TBBbxd').then(response => response.text())
    const input = data.split(',').map(code => +code).reduce((acc, code, index) => {
        acc[index] = code

        return acc
    }, {})

    const memory = {...input}
    const index = 0
    let lastOutput
    let outputCount = 0
    let blockCount = 0

    const stdout = (output) => {
        outputCount += 1

        lastOutput = output

        if (lastOutput === 2 && outputCount % 3 === 0) {
            blockCount += 1
        }
    }

    while (lastOutput !== 'HALT') {
        computer(memory, index, undefined, stdout)
    }

    console.log(blockCount)
}

main()
