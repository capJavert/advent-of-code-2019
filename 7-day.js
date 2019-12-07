require('es6-promise').polyfill()
require('isomorphic-fetch')

const swap = (anagram, i, j) => {
    const tmp = anagram[i]
    /* eslint-disable no-param-reassign */
    anagram[i] = anagram[j]
    anagram[j] = tmp
    /* eslint-enable no-param-reassign */
}

function getAnagrams(input) {
    const counter = []
        const anagrams = []
        const {length} = input
        let i

    for (i = 0; i < length; i += 1) {
        counter[i] = 0
    }

    anagrams.push(input)
    let temp = [...input]
    i = 0

    while (i < length) {
        if (counter[i] < i) {
            swap(temp, i % 2 === 1 ? counter[i] : 0, i)
            counter[i] += 1
            i = 0
            anagrams.push(temp)
            temp = [...temp]
        } else {
            counter[i] = 0
            i += 1
        }
    }

    return anagrams
}

const intcodeComputer = (intcode, inputs, stdout = console.log) => {
    const program = [...intcode]
    const programSize = program.length
    let index = 0

    const readOpcode = () => {
        const params = program[index].toString().split('')
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
            return program[program[parameterIndex]]
        }

        return program[parameterIndex]
    }

    let { code, modes } = readOpcode()

    while (code !== 99 && index < programSize) {
        switch (code) {
            case 1:
                program[getParameter(3, 1)] = getParameter(1, modes) + getParameter(2, modes)
                index += 4
                break
            case 2:
                program[getParameter(3, 1)] = getParameter(1, modes) * getParameter(2, modes)
                index += 4
                break
            case 3:
                if (!inputs.length) {
                    throw new Error('No program inputs are available!')
                }

                program[getParameter(1, 1)] = inputs.shift()
                index += 2
                break
            case 4:
                stdout(getParameter(1, modes))
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
                program[getParameter(3, 1)] = getParameter(1, modes) < getParameter(2, modes) ? 1 : 0
                index += 4
                break
            case 8:
                program[getParameter(3, 1)] = getParameter(1, modes) === getParameter(2, modes) ? 1 : 0
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

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/3H0uuqZb').then(response => response.text())
    const input = data.split(',').map(code => +code)

    let maxOutput = 0
    let lastOutput = 0

    const stdout = (output => {
        lastOutput = output
    })

    getAnagrams([0, 1, 2, 3, 4]).forEach(anagram => {
        lastOutput = 0

        anagram.forEach(programInput => {
            intcodeComputer(input, [programInput, lastOutput], stdout)
        })

        maxOutput = Math.max(maxOutput, lastOutput)
    })

    console.log(maxOutput)
}

main()
