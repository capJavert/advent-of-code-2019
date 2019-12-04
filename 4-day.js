require('es6-promise').polyfill()
require('isomorphic-fetch')

const doubleRegex = /(\d)\1+/g

/* eslint-disable no-continue */
const main = async() => {
    const data = '356261-846303'
    const input = data.split('-').map(item => +item)

    let result = 0

    for (let i = input[0]; i <= input[1]; i += 1) {
        const password = i.toString()

        const doubleMatch = password.match(doubleRegex)
        if (!doubleMatch || !password.match(doubleRegex).some(match => match.length === 2)) {
            continue
        }

        if (password.split('').some((char, index) => index > 0 && +char < +password[index - 1])) {
            continue
        }

        result += 1
    }

    console.log(result)
}

main()
