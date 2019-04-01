var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const robots = {
  input: require('./robots/input.js'),
  text: require('./robots/text.js'),
  state: require('./robots/state.js'),
  //image: require('./robots/image.js')
}


const slugify = require('slugify')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('chat message', "Insira os dados da busca separados por vírgulas desta forma: CONTEXTO,QUEM,QUANTIDADE,IDIOMA(pt/es/en)<br><br>Lembre-se: a busca tem que ser no mesmo idioma solicitado!");

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    let infos = msg.split(',')
    /*
    Parametros de MSG:
    0 - Contexto
    1 - O que / Quem
    2 - Quantidade
    3 - Idioma
    */
    const slug = slugify(infos[0]+'_'+infos[1])
    
    socket.emit('chat message', 'Buscando '+infos[2]+' resultados em '+infos[3]+' para '+infos[0]+' '+infos[1]);

    robots.input(slug,infos)

    socket.emit('chat message','Recoste a cadeira e aguarde enquanto os Minions buscam seu conteúdo...<br><img src="/minions.gif"/>')

    const results = await robots.text(slug)
    console.log(results);
    socket.emit('chat message', JSON.stringify(results));
    
    //await robots.image(slug,infos)

  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
