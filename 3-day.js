require('es6-promise').polyfill()
require('isomorphic-fetch')

const manhattan = (p, q) => Math.abs(p.x - q.x) + Math.abs(p.y - q.y)

const main = async() => {
    const data = await fetch('https://pastebin.com/raw/B6G5dmir').then(response => response.text())
    const input = data.split(/\r?\n/)

    const wires = []
    const intersections = []
    let result = null
    const center = { x: 0, y: 0 }

    input.forEach((item, index) => {
        const path = item.split(',')
        wires.push({})
        let { x, y } = center

        const followWire = (axis, wire, move, moveValue) => {
            for (let i = 0; i < move; i += 1) {
                if (axis === 'x') {
                    x += moveValue
                } else {
                    y += moveValue
                }

                if (wire === 1 && wires[0][`${x},${y}`]) {
                    const distance = manhattan(center, { x, y })
                    intersections.push({ x, y })

                    if (result) {
                        result = Math.min(result, distance)
                    } else {
                        result = distance
                    }

                }

                wires[wire][`${x},${y}`] = true
            }
        }

        path.forEach(part => {
            const direction = part[0]
            const move = +part.slice(1)

            switch (direction) {
                case 'U':
                    followWire('y', index, move, -1)
                    break
                case 'R':
                    followWire('x', index, move, +1)
                    break
                case 'D':
                    followWire('y', index, move, +1)
                    break
                case 'L':
                    followWire('x', index, move, -1)
                    break
                default:
                    break
            }
        })
    })

    console.log(result)
}

main()
