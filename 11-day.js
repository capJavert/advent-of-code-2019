require('es6-promise').polyfill()
require('isomorphic-fetch')

const { computer } = require('./intcode')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/h50sVZ7Q').then(response => response.text())
    const input = data.split(',').map(code => +code).reduce((acc, code, index) => {
        acc[index] = code

        return acc
    }, {})

    const hull = {}
    let memory = {...input}
    let index = 0
    let lastOutput
    const robot = { x: 0, y: 0, direction: 0 }
    let uniquePaints = 0
    let outputCount = 0

    const stdin = () => {
        const id = `${robot.x}:${robot.y}`

        if (hull[id] === undefined) {
            return 0
        }

        return hull[id]
    }

    const stdout = (output, { memory: newMemory, index: newIndex }) => {
        index = newIndex
        memory = newMemory
        lastOutput = output
        const id = `${robot.x}:${robot.y}`

        if (outputCount === 0) {
            if (hull[id] === undefined) {
                uniquePaints += 1
            }
            hull[id] = output === 0 ? 0 : 1
        } else {
            const move = output ? +1 : -1
            robot.direction = (robot.direction + move) % 4
            robot.direction = robot.direction < 0 ? 3 : robot.direction

            switch (robot.direction) {
                case 0:
                    robot.y += 1
                    break
                case 1:
                    robot.x += 1
                    break
                case 2:
                    robot.y -= 1
                    break
                case 3:
                    robot.x -= 1
                    break
                default:
                    throw new Error(`Invalid robot direction state ${robot.direction} encountered!`)
            }
        }

        outputCount += 1

        return outputCount > 1
    }

    while (lastOutput !== 'HALT') {
        computer(memory, index, stdin, stdout)
        outputCount = 0
    }

    console.log(uniquePaints)
}

main()
