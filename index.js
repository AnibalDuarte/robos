const readline = require('readline-sync')
const robots = {
    text: require('./robots/text.js')
}

async function start(){
    const content = {}

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    await robots.text(content)

    function askAndReturnSearchTerm(){
        return readline.question('Escolha o termo de pesquisa no Wikipedia: ')
    }

    function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The history'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes,'Escolha uma opção: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }

    console.log(content);
}

start()