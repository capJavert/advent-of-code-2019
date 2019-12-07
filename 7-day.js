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

const intcodeComputer = (intcode, cursor, stdin, stdout = console.log) => {
    const program = [...intcode]
    const programSize = program.length
    let index = cursor

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
    let pause = false

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
                program[getParameter(1, 1)] = stdin()
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

        if (pause) {
            break
        }

        const opcode = readOpcode()
        code = opcode.code
        modes = opcode.modes
    }

    if (!pause) {
        stdout('HALT')
    }
}

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/3H0uuqZb').then(response => response.text())
    // const data = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'
    const input = data.split(',').map(code => +code)

    let maxOutput = 0

    getAnagrams([5, 6, 7, 8, 9]).forEach(anagram => {
        let lastOutput = 0
        let ampIndex = 0
        let didHalt = false
        const amplifiers = new Array(5).fill(null).map(() => ({ memory: null, index: 0 }))

        const stdin = () => {
            const { memory, started } = amplifiers[ampIndex]
            let value

            if (!memory && !started) {
                amplifiers[ampIndex].started = true
                value = anagram.shift()
            } else {
                value = lastOutput
            }

            return value
        }

        const stdout = ((output, state) => {
            if (output !== 'HALT') {
                lastOutput = output

                if (ampIndex === 4) {
                    maxOutput = Math.max(maxOutput, lastOutput)
                }

                amplifiers[ampIndex] = state
                ampIndex = (ampIndex + 1) % 5

                return true
            }

            if (ampIndex === 4) {
                didHalt = true
            }

            amplifiers[ampIndex] = state
            ampIndex = (ampIndex + 1) % 5

            return false
        })

        while (!didHalt) {
            const { memory, index } = amplifiers[ampIndex]
            intcodeComputer(memory || input, index, stdin, stdout)
        }
    })

    console.log(maxOutput)
}

main()
