const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
  const content = {
    maximumSentences: 7,
    useFecthContentFromWikipediaAlgorithmia: true
  }

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  content.lang = askAndReturnLanguage()
  state.save(content)

  function askAndReturnSearchTerm() {
    return readline.question('Insira um termo para a Wikipedia: ')
  }

  function askAndReturnPrefix() {
    const prefixes = ['Quem e', 'O que e', 'A historia de ']
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma opção: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex]

    return selectedPrefixText
  }

  function askAndReturnLanguage(){
    return 'pt'
		const language = ['pt','en', 'es', 'fr']
		const selectedLangIndex = readline.keyInSelect(language,'Escolha o Idioma: ')
		const selectedLangText = language[selectedLangIndex]
		return selectedLangText
  }
}

module.exports = robot