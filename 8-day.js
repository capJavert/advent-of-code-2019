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

    const image = layers.reduce((acc, layer) => {
        layer.forEach((digit, index) => {
            if (acc[index] === undefined || acc[index] === 2) {
                acc[index] = digit
            }
        })

        return acc
    })


    let render = ''

    image.forEach((pixel, index) => {
        if (index && index % size.width === 0) {
            render += '\n'
        }

        render += pixel === 0 ? '■' : '□'
    })

    console.log(render)
}

main()
