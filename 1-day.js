require('es6-promise').polyfill()
require('isomorphic-fetch')

async function main() {
    const data = await fetch('https://pastebin.com/raw/yVSKxTnK').then(response => response.text())
    const input = data.split(/\r?\n/)

    const result = input.reduce((acc, item) => {
        return acc + Math.floor(+item / 3) - 2
    }, 0)

    console.log(result)
}

main()
