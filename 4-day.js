require('es6-promise').polyfill()
require('isomorphic-fetch')

const doubleRegex = /(\d)\1+/

/* eslint-disable no-continue */
const main = async() => {
    const data = '356261-846303'
    const input = data.split('-').map(item => +item)

    let result = 0

    for (let i = input[0]; i <= input[1]; i += 1) {
        const password = i.toString()


        if (!doubleRegex.test(password)) {
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
