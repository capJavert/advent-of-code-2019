require('es6-promise').polyfill()
require('isomorphic-fetch')

const getRelativeCoord = (x, y, base) => ({ x: x - base.x, y: y - base.y })

const getDistance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)

const main = async() => {
    const data = await fetch('https://pastebin.com/raw/tdjsvL4J').then(response => response.text())
    // const data = await fetch('https://pastebin.com/raw/aWQqiyJk').then(response => response.text())
    // const data = await fetch('https://pastebin.com/raw/yiXqJf0s').then(response => response.text())
    // const data = await fetch('https://pastebin.com/raw/XC5b4H6Q').then(response => response.text())
    // const data = await fetch('https://pastebin.com/raw/uvA0Y4B7').then(response => response.text())
    const input = data.split(/\r?\n/).reduce((acc, line, y) => {
        acc[y] = []

        line.split('').forEach((item) => {
            acc[y].push(item)
        })

        return acc
    }, [])

    const getGrads = (base) => {
        const grads = []
        const iL = Object.keys(input).length
        const jL = Object.keys(input[0]).length

        for (let i=0; i<iL; i+=1) {
            for (let j=0; j<jL; j+=1) {
                const { x, y } = getRelativeCoord(j, i, base)
                let grad = y / x
                grad = (y === 0 && x < 0) ? '-0' : grad.toString()

                if (input[i][j] === '#' && (x !== 0 || y !== 0)) {
                    grads.push({
                        oId: `${j}:${i}`,
                        id: `${x}:${y}`,
                        grad,
                        distance: getDistance(x, y, 0, 0),
                        sideY: y > 0,
                        sideX: x > 0
                    })
                }
            }
        }

        return grads
    }

    const getVisibleCount = (base) => {
        const grads = getGrads(base)
        const visible = {}
        const relativeInput = {}

        input.forEach((line, oY) => {
            line.forEach((asteroid, oX) => {
                const { x, y } = getRelativeCoord(oX, oY, base)
                const id = `${x}:${y}`
                let grad = y / x
                grad = (y === 0 && x < 0) ? '-0' : grad.toString()
                const distance = getDistance(x, y, 0, 0)
                const sideY = y > 0
                const sideX = x > 0

                if (!relativeInput[y]) {
                    relativeInput[y] = {}
                }
                relativeInput[y][x] = asteroid

                if (asteroid === '#' && (x !== 0 || y !== 0) && visible[id] === undefined ? true : visible[id]) {
                    grads.forEach(item => {
                        const isObscured = item.id !== id && grad === item.grad && item.distance > distance && sideY === item.sideY && sideX === item.sideX
                        if (isObscured) {
                            visible[item.id] = false
                        }
                    })
                }
            })
        })

        return Object.keys(grads).length - Object.keys(visible).length
    }

    let maxCount = 0
    let result

    input.forEach((line, y) => {
        line.forEach((asteroid, x) => {
            if (asteroid === '#') {
                const coord = { x, y }
                const visibleCount = getVisibleCount(coord)

                if (maxCount < visibleCount) {
                    maxCount = visibleCount
                    result = coord
                }
            }
        })
    })

    console.log(result, maxCount)
}

main()
