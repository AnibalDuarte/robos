const readline = require('readline-sync')

function start(){
    const content = {}

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm(){
        return readline.question('Escolha o termo de pesquisa no Wikipedia: ')
    }

    function askAndReturnPrefix(){
        const prefixes = ['Quem eh', 'O que eh', 'A historia'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes,'Escolha uma opção: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }

    console.log(content);
}

start()