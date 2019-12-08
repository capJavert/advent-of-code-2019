require('es6-promise').polyfill()
require('isomorphic-fetch')

const main = async() => {
    const data = await fetch('https://pastebin.com/raw/gW0hEHDY').then(response => response.text())
    const input = data.split('').map(code => +code)

    const size = {
        width: 25,
        height: 6
    }
    const layerSize = size.width * size.height
    const layers = []

    let layerIndex = -1

    input.forEach((digit, index) => {
        if (index % layerSize === 0) {
            layers.push([])
            layerIndex += 1
        }

        layers[layerIndex].push(digit)
    })

    let min = Infinity
    let result = 0

    layers.forEach(layer => {
        const checksum = layer.reduce((acc, digit) => {
            acc[digit] += 1

            return acc
        }, { 0: 0, 1: 0, 2: 0})

        if (checksum[0] < min) {
            min = checksum[0] // eslint-disable-line prefer-destructuring
            result = checksum[1] * checksum[2]
        }
    })

    console.log(result)
}

main()
