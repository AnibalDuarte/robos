var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


const robots = {
  input: require('./robots/input.js'),
  text: require('./robots/text.js'),
  state: require('./robots/state.js'),
  image: require('./robots/image.js')
}


const slugify = require('slugify')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
}).use(express.static(path.join(__dirname, '/robots')));

app.get('/minions.gif', function(req, res){
  res.sendFile(__dirname + '/minions.gif');
});


io.on('connection', function(socket){
  socket.emit('chat message', "Seja bem vindo ao BOT de buscas! Insira o que quer saber que eu encontro para você!");

  socket.on('disconnect', function(){
    
  });
  socket.on('chat message', function(m){
    let infos = m.split('|')
    /*
    Parametros de MSG:
    0 - Contexto
    1 - O que / Quem
    2 - Quantidade
    */
    const slug = slugify(infos[0]+'_'+infos[1])
    

    socket.emit('chat message', 'Buscando '+infos[2]+' resultados para '+infos[0]+' '+infos[1])


    socket.emit('chat message','Recoste a cadeira e aguarde enquanto os Minions buscam seu conteúdo...<br><img src="/minions.gif"/>')
    
    start(slug,infos)

  });

  async function start(slug,infos) {
    app.use(express.static(path.join(__dirname, '/robots/'+slug)));
    robots.input(slug,infos)
    const texts = await robots.text(slug)
    socket.emit('chat message','Encontramos várias coisas! Espere um minuto, vamos buscar algumas imagens legais...')
    await robots.image(slug,infos)
    socket.emit('chat message','Pronto! Aqui estão os seus resultados:')
    let contador = 1;
    for (var i = 0, len = texts.sentences.length; i < len; i++) {
      contador = i + 1;
      socket.emit('chat message', texts.sentences[i]['text']);
      socket.emit('chat message', '<img src="/'+slug+'/'+i+'-original.png" style="width:auto;height:400px;"/>');
    }
    

    socket.emit('chat message', 'Este é o fim, obrigado e tenha um bom dia!');
  }
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
