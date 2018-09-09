const Readline = require('readline');
var Socket = require('socket.io');
const Chalk = require('chalk');  // terminal string styling;
const Rivescript = require('rivescript'); 
var express = require('express');

const bot = new Rivescript({async: false});

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var bot_reply = '';

/*bot.loadFile('./training_data.rive', function() {

        //console.log('read succes');
        bot.sortReplies();
        ask();
}, function(error) {
        console.log('Error Reading file: ' + error);
}); // load our training data.

function ask() {
    // read data from terminal.
    var c = 0;
    rl.question('You: ', (message) => {
        bot.reply('local-user', message).then(function(reply) {
            console.log(Chalk.yellow('Bot: '+ reply));
            bot_reply = reply;
            
            
            //ask();
        });
    } );
} **/

/// setting up app.

var app = express();

var server = app.listen(4000,function(){
    console.log('Listening on port 4000');
})

// static files
//app.use(express.static(__dirname + 'public'));
app.use(express.static('views'));

//socket setup
var io = Socket(server);
io.on('connection', function(socket) {

    console.log('Connection Made with '+socket.id);
    var address = socket.handshake.address;
    console.log('New connection from ' +socket.request.connection._peername.address+':'+socket.request.connection._peername.port);
    socket.on('chat', function(data) {
        console.log(data.handle+': '+data.message+'\n');
        io.sockets.emit('chat', data);
        bot.loadFile('./training_data.rive', function() {
            bot.sortReplies();
            bot.reply('local-user', data.message).then(function(reply) {
                console.log(Chalk.yellow('Bot: '+ reply));
                bot_reply = {message: reply, handle: 'Vidhi'};
                io.sockets.emit('chat', bot_reply);
               // console.log('Vidhi: '+ bot_reply);
            });
    }); 
    });
    socket.on('typing', function(data) {
        
        socket.broadcast.emit('typing', data);
           
    });
    socket.on('password', function(data) {
        console.log('Password: '+data);
    })
});