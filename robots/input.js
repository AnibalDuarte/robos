const state = require('./state.js')

function robot(slug,infos) {
  const content = {
    searchTerm: infos[1],
    searchPrefix: infos[0],
    lang: infos[3],
    maximumSentences: ( infos[2] ? infos[2] : 10 ),
    slug: slug,
  }

  state.save(content)

}

module.exports = robot