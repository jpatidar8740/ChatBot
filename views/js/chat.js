
var socket = io.connect();

// Query DOM 
var msg = document.getElementById('message');
    handle = document.getElementById('handle');
    btn = document.getElementById('send');
    b = document.getElementById('login');
    output = document.getElementById('output');
    feedback = document.getElementById('feedback');
    password = document.getElementById('password');

// EventListener

btn.addEventListener('click', function(){
    socket.emit('chat', {
        handle: handle.value,
        message: msg.value,
    });
    msg.value = '';
});

b.addEventListener('click', function(){
    socket.emit('password', password.value);
    handle.value = document.getElementById('username').value;
})

msg.addEventListener('keypress', function() {
    socket.emit('typing', handle.value);
});

msg.addEventListener('keyup', function() {
    feedback.innerHTML = '';
});

msg.addEventListener("keyup", function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      document.getElementById("send").click();
    }
  });

// listen for Event

socket.on('chat', function(data) {
    output.innerHTML += '<p><strong>'+data.handle+'</strong>: '+data.message+' </p>';
});

socket.on('typing', function(data) {
    feedback.innerHTML = '<p>'+data+' is typing message!</p>'
})