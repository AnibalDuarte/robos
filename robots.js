const robots = {
    input: require('./robots/input.js'),
    text: require('./robots/text.js'),
    state: require('./robots/state.js'),
    image: require('./robots/image.js')
  }

const slugify = require('slugify')

/*
Parametros de MSG:
0 - Sentido
1 - O que / Quem
2 - Quantidade
3 - Idioma
*/

const infos = process.argv;

const slug = slugify(infos[0]+'_'+infos[1])
  
  async function start() {
    robots.input(slug,infos)
    await robots.text(slug)
    //await robots.image(slug)
  
    const content = robots.state.load(slug)
    console.dir(content, { depth: null })
  }
  
  start()