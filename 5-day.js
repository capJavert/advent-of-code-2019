require('es6-promise').polyfill()
require('isomorphic-fetch')

const main = async() => {
    const data = await fetch('https://pastebin.com/raw/4VjbCzNL').then(response => response.text())
    const input = data.split(',').map(code => +code)

    const programInputs = [5]
    const programSize = input.length
    let index = 0

    const readOpcode = () => {
        const params = input[index].toString().split('')
        const opcode2 = params.pop()
        const opcode1 = params.pop()
        const code = +`${opcode1 || ''}${opcode2}`
        const modes = []

        while (params.length > 0) {
            modes.push(+params.pop())
        }

        return { code, modes }
    }

    const getParameter = (position, modes) => {
        const mode = Array.isArray(modes) ? (modes[position - 1] || 0) : modes

        const parameterIndex = index + position

        if (mode === 0) {
            return input[input[parameterIndex]]
        }

        return input[parameterIndex]
    }

    let { code, modes } = readOpcode()

    while (code !== 99 && index < programSize) {
        switch (code) {
            case 1:
                input[getParameter(3, 1)] = getParameter(1, modes) + getParameter(2, modes)
                index += 4
                break
            case 2:
                input[getParameter(3, 1)] = getParameter(1, modes) * getParameter(2, modes)
                index += 4
                break
            case 3:
                if (!programInputs.length) {
                    throw new Error('No program inputs are available!')
                }

                input[getParameter(1, 1)] = programInputs.shift()
                index += 2
                break
            case 4:
                console.log(getParameter(1, modes))
                index += 2
                break
            case 5:
                if (getParameter(1, modes)) {
                    index = getParameter(2, modes)
                } else {
                    index += 3
                }
                break
            case 6:
                if (!getParameter(1, modes)) {
                    index = getParameter(2, modes)
                } else {
                    index += 3
                }
                break
            case 7:
                input[getParameter(3, 1)] = getParameter(1, modes) < getParameter(2, modes) ? 1 : 0
                index += 4
                break
            case 8:
                input[getParameter(3, 1)] = getParameter(1, modes) === getParameter(2, modes) ? 1 : 0
                index += 4
                break
            default:
                throw new Error(`Unknown opcode ${code} encountered!`)
        }

        const opcode = readOpcode()
        code = opcode.code
        modes = opcode.modes
    }
}

main()
