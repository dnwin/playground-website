/**
 * Created by dennis on 11/13/15.
 */
var socket = io.connect();

$(document).ready(function() {
   var chatApp = new Chat(socket);

    // Display resulst of name change attempt.
    socket.on('nameResult', function(result) {
        var message;

        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else { // failed, error
            message = result.message;
        }
        $("#messages").append(divSystemContentElement(message));
    });

    // Display result of room chagne
    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed.'));
    });

    // Incoming messages
    socket.on('message', function(message) {
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });


    // Request update of rooms every second
    setInterval(function() {
        socket.emit('rooms');
    }, 1000);

    // Display list of rooms available
    socket.on('rooms', function(rooms) {
        $('#room-list').empty(); // Empty out current rooms

        for (var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }

        // Allow clicking of the room to change rooms
        $("#room-list div").click(function() {
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });

    console.log("configuring form");
    $('#send-message').focus();

    $('#send-form').submit(function() {
        console.log("Sending message");
        processUserInput(chatApp, socket);
        return false;
    });



});







// Helper functions.
// Handle untrusted text
function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
    var message = $("#send-message").val();
    var systemMessage;

    var $messagesEl = $("#messages");

    // If input begins with slash, treat as a command.
    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            // Display in chatroom as italics
            $messagesEl.append(divSystemContentElement(systemMessage));
        }
    } else { // Normal message
        // Broadcast non-cmomand input to all users.
        chatApp.sendMessage($('#room').text(), message);
        $messagesEl.append(divEscapedContentElement(message));
        // Scroll to the bottom
        $messagesEl.scrollTop($messagesEl.prop('scrollHeight'));
    }

    // Clear the message send input
    $("#send-message").val("");

}
