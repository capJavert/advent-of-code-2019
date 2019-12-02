require('es6-promise').polyfill()
require('isomorphic-fetch')

const main = async() => {
    const data = await fetch('https://pastebin.com/raw/Amih4G6D').then(response => response.text())
    const input = data.split(',').map(code => +code)
    input[1] = 23
    input[2] = 47

    const programSize = input.length
    let index = 0
    let code = input[index]

    while (code !== 99 && index < programSize) {
        const a = input[input[index + 1]]
        const b = input[input[index + 2]]

        switch (code) {
            case 1:
                input[input[index + 3]] = a + b
                break
            case 2:
                input[input[index + 3]] = a * b
                break
            default:
                break
        }

        index += 4
        code = input[index]
    }

    console.log(100 * input[1] + input[2])
}

main()
