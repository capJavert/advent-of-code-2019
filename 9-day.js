require('es6-promise').polyfill()
require('isomorphic-fetch')

const intcodeComputer = (intcode, cursor = 0, stdin = () => {
    throw new Error('Program requires stdin')
}, stdout = console.log) => {
    const program = {...intcode}
    let relativeBase = 0
    let index = cursor

    const getValue = (position) => {
        if (program[position] === undefined) {
            return 0
        }

        return program[position]
    }

    const readOpcode = () => {
        const params = getValue(index).toString().split('')
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
        const mode = modes[position - 1] || 0

        const parameterIndex = index + position

        if (mode === 0) {
            return getValue(getValue(parameterIndex))
        }

        if (mode === 2) {
            return getValue(getValue(parameterIndex) + relativeBase)
        }

        return getValue(parameterIndex)
    }

    const setParameter = (position, value, modes) => {
        const mode = modes[position - 1] || 0

        const parameterIndex = index + position

        if (mode === 0) {
            program[program[parameterIndex]] = value
            return true
        }

        if (mode === 2) {
            program[program[parameterIndex] + relativeBase] = value
            return true
        }

        throw new Error(`Invalid write mode '${mode}' encountered!`)
    }

    let { code, modes } = readOpcode()
    let pause = false

    while (code !== 99) {
        switch (code) {
            case 1:
                setParameter(3, getParameter(1, modes) + getParameter(2, modes), modes)
                index += 4
                break
            case 2:
                setParameter(3, getParameter(1, modes) * getParameter(2, modes), modes)
                index += 4
                break
            case 3:
                setParameter(1, stdin(), modes)
                index += 2
                break
            case 4:
                pause = stdout(getParameter(1, modes), { memory: program, index: index + 2 })
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
                setParameter(3, getParameter(1, modes) < getParameter(2, modes) ? 1 : 0, modes)
                program[getParameter(3, 1)] = getParameter(1, modes) < getParameter(2, modes) ? 1 : 0
                index += 4
                break
            case 8:
                setParameter(3, getParameter(1, modes) === getParameter(2, modes) ? 1 : 0, modes)
                index += 4
                break
            case 9:
                relativeBase += getParameter(1, modes)
                index += 2
                break
            default:
                throw new Error(`Unknown opcode ${code} encountered!`)
        }

        if (pause) {
            break
        }

        const opcode = readOpcode()
        code = opcode.code
        modes = opcode.modes
    }

    if (!pause) {
        stdout('HALT', { memory: program, index })
    }
}

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/zkGKwFfb').then(response => response.text())
    // const data = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'
    const input = data.split(',').map(code => +code).reduce((acc, code, index) => {
        acc[index] = code

        return acc
    }, {})

    intcodeComputer(input, 0, () => 2, (output) => {
        console.log('output', output)
    })

    console.log()
}

main()
