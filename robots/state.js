const fs = require('fs')

function save(content) {
  mkd(content.slug)
  const contentFilePath = __dirname +  '/'+content.slug+'/content.json'  
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

function load(slug) {
  mkd(slug)
  const contentFilePath = __dirname +  '/'+slug+'/content.json'  
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

function mkd(dir){
  if(!fs.exists(dir)) {
    console.log('Criando diretorio '+dir)
    fs.mkdir(__dirname +  '/'+dir, { recursive: true }, (err) => {
      console.log(err)
    });
  } else {
      console.log('Diretorio '+dir+' ja existe')    
  }
  
}

module.exports = {
  save,
  load
}