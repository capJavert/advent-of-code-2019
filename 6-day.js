require('es6-promise').polyfill()
require('isomorphic-fetch')

const bfs = (next, searchKey, taskFn = null, queue = []) => {
    const node = next.original || next

    if (typeof taskFn === 'function') {
        taskFn(node, next.depth || 0)
    }

    if (node.key === searchKey) {
        return node
    }

    node.leaves.forEach(leaf => {
        queue.push({ ...leaf, original: leaf, depth: (next.depth || 0) + 1 })
    })

    if (!queue.length) {
        return null
    }

    return bfs(queue.shift(), searchKey, taskFn, queue)
}

const main = async() => {
    const data = await fetch('https://pastebin.com/raw/SeSpe6CQ').then(response => response.text())
    // const data = await fetch('https://pastebin.com/raw/XN1zskiu').then(response => response.text())
    const input = data.split(/\r?\n/)

    const objectsMap = {}

    const directOrbits = input.reduce((acc, item) => {
        const orbit = item.split(')')

        objectsMap[orbit[0]] = orbit[0] // eslint-disable-line prefer-destructuring
        objectsMap[orbit[1]] = orbit[1] // eslint-disable-line prefer-destructuring

        if (!acc[orbit[0]]) {
            acc[orbit[0]] = {}
        }

        acc[orbit[0]][orbit[1]] = true

        return acc
    }, {})

    const objects = Object.values(objectsMap)
    const tree = {
        key: 'COM',
        leaves: []
    }

    const queue = ['COM']

    while (objects.length) {
        const current = queue.shift()
        const index = objects.findIndex(item => item === current)
        objects.splice(index, 1)
        const orbits = directOrbits[current]

        if (!orbits) {
            continue // eslint-disable-line no-continue
        }

        const object = bfs(tree, current)

        if (object) {
            object.leaves = [
                ...object.leaves,
                ...Object.keys(orbits).map(leaf => {
                    queue.push(leaf)

                    return {
                        key: leaf,
                        leaves: []
                    }
                })
            ]
        }
    }

    const orbitsCounts = {}

    const countOrbits = (node, depth) => {
        orbitsCounts[node.key] = 0

        if (node.key === 'COM') {
            return
        }

        orbitsCounts[node.key] += depth
    }

    bfs(tree, null, countOrbits)

    console.log(Object.values(orbitsCounts).reduce((acc, count) => acc + count, 0))
}

main()
