const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content){
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponde.get() 

        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content){
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParenthesis = removeDatesInParenthesis(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitized = withoutDatesInParenthesis

        function removeBlankLinesAndMarkdown(text){
            const allLines = text.split('\n')
            
            const withoutBlankLinesAndMarkdowns = allLines.filter((line) => {
                if(line.trim().length === 0 || line.trim().startsWith('=')){
                    return false
                }

                return true
            })

            return withoutBlankLinesAndMarkdowns.join(' ')
        }

        function removeDatesInParenthesis(text){
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }

       
    }

    function breakContentIntoSentences(content){
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        
        sentences.forEach((sentence)=>{
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
        
        
        console.log(sentences)
    }

}

module.exports = robot