/**
 * Created by dennis on 11/13/15.
 */
// Chat class

// Constructor
var Chat = function(socket) {
    this.socket = socket;
};


// Send chat messages
Chat.prototype.sendMessage = function(room, text) {
    var message = {
        room: room,
        text: text
    };
    this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    });
};

// process input commands
Chat.prototype.processCommand = function(command) {
    var words = command.split(' ');
    // only take command from first word
    var command = words[0]
        .substring(1, words[0].length)
        .toLowerCase();

    var message = false;

    switch(command) {
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;

        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name);
            break;

        default:
            message = "Unrecognized command.";
            break;
    }

    return message;
};
