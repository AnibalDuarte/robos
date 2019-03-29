const prompts = require('prompts')
const state = require('./state.js')
const trends = require('./searchHotTrends.js');

function robot() {
  const content = {
    maximumSentences: 7
  }

  content.searchTerm = askAndReturnAnswers()
  //content.prefix = askAndReturnPrefix()
  state.save(content)

  async function askAndReturnAnswers() {
    const questions = [
      {
        type: 'select',
        name: 'searchTerm',
        message: 'Escolha o Trend Topic:',
        choices: await trends.searchHotTrends(count=9),
        validate: value => typeof value === 'string' ? value.trim() !== '' : false,
      },
      {
        type: 'select',
        name: 'prefix',
        message: 'Escolha a abordagem:',
        choices: ['Mais sobre', 'A historia de '],
        validate: value => typeof value === 'string' ? value.trim() !== '' : false,
      }
    ];

    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error('The user has stopped answering'))
      }
      const response = await prompts(questions, promptOptions)
      console.log(questions[0]['choices'][response.searchTerm])
      resolve(response)
    });
  }

}

module.exports = robot