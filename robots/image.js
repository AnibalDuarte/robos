const imageDownloader = require('image-downloader')
const gm = require('gm').subClass({imageMagick: true})
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state.js')

const googleSearchCredentials = require('../credentials/google-search.json')

async function robot(slug) {
  const content = state.load(slug)

  await fetchImagesOfAllSentences(content)
  await downloadAllImages(content)
  await createAllSentenceImages(content)
  await convertAllImages(content)
  await createYouTubeThumbnail()

  state.save(content)

  async function fetchImagesOfAllSentences(content) {
    for (const sentence of content.sentences) {
      const query = `${content.searchTerm} ${sentence.keywords[0]}`
      sentence.images = await fetchGoogleAndReturnImagesLinks(query)

      sentence.googleSearchQuery = query
    }
  }

  async function fetchGoogleAndReturnImagesLinks(query) {
    const response = await customSearch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: 'image',
      num: 2
    })

    const imagesUrl = response.data.items.map((item) => {
      return item.link
    })

    return imagesUrl
  }

  async function downloadAllImages(content) {
    content.downloadedImages = []

    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      const images = content.sentences[sentenceIndex].images

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex]

        try {
          // if (content.downloadedImages.includes(imageUrl)) {
          //   throw new Error('Imagem já foi baixada')
          // }

          await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
          content.downloadedImages.push(imageUrl)
          console.log(`> [${sentenceIndex}][${imageIndex}] Baixou imagem com sucesso: ${imageUrl}`)
          break
        } catch(error) {
          console.log(`> [${sentenceIndex}][${imageIndex}] Erro ao baixar (${imageUrl}): ${error}`)
        }
      }
    }
  }

  async function downloadAndSave(url, fileName) {
    return imageDownloader.image({
      url, url,
      dest: __dirname +  `/${slug}/${fileName}`
    })
  }

  async function convertAllImages(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      await convertImage(sentenceIndex)
    }
  }

  async function convertImage(sentenceIndex) {
    return new Promise((resolve, reject) => {
      const inputFile = __dirname +  `/${slug}/${sentenceIndex}-original.png[0]`
      const outputFile = __dirname +  `/${slug}/${sentenceIndex}-converted.png`
      const width = 1920
      const height = 1080

      gm()
        .in(inputFile)
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-blur', '0x9')
          .out('-resize', `${width}x${height}^`)
        .out(')')
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-resize', `${width}x${height}`)
        .out(')')
        .out('-delete', '0')
        .out('-gravity', 'center')
        .out('-compose', 'over')
        .out('-composite')
        .out('-extent', `${width}x${height}`)
        .draw([`gravity SouthEast image Over 0,0 1000,400 "` + __dirname +  `/${slug}/${sentenceIndex}-sentence.png"`])
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> Image converted: ${inputFile}`)
          resolve()
        })

    })
  }

  async function createAllSentenceImages(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      await createSentenceImage(sentenceIndex, content.sentences[sentenceIndex].text,content.slug)
    }
  }

  async function createSentenceImage(sentenceIndex, sentenceText, slug) {
    return new Promise((resolve, reject) => {
      const outputFile = `./${slug}/${sentenceIndex}-sentence.png`

      const templateSettings = {
        0: {
          size: '1000x400',
          gravity: 'center'
        }
      }
      
      
      gm()
        .out('-size', templateSettings[0].size)
        .out('-gravity', templateSettings[0].gravity)
        .out('-background', 'white')
        .out('-fill', 'black')
        .out('-kerning', '-1')
        .out(`caption:${sentenceText}`)
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> Sentence created: ${outputFile}`)
          resolve()
        })
    })
  }

  async function createYouTubeThumbnail() {
    return new Promise((resolve, reject) => {
      gm()
        .in(__dirname +  `/${slug}/0-converted.png`)
        .write(__dirname +  `/${slug}/youtube-thumbnail.jpg`, (error) => {
          if (error) {
            return reject(error)
          }

          console.log('> Creating YouTube thumbnail')
          resolve()
        })
    })
  }

}

module.exports = robot