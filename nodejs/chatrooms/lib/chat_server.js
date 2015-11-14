/**
 * Created by dennis on 11/13/15.
 */
var socketio = require('socket.io');


var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};


exports.listen = function(server) {

    // Start socketio server, allowing it to piggy back off existing HTTP server
    io = socketio.listen(server);

    // Define how each user connection will be handled
    io.sockets.on('connection', function (socket) {
        // Assign user a guest name when they connect
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        // Place user in lobby room when they connect
        joinRoom(socket, 'Lobby');
        // Handle user name change, messages, room creation
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        // provide user with list of occupied rooms on request
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        handleClientDisconnection(socket, nickNames, namesUsed);
    })
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {

    // Generate new guest name;
    var name = 'Guest' + guestNumber;

    // Associate guest name with client id.
    nickNames[socket.id] = name;

    // Let user know their guest name
    socket.emit('nameResult', {
        success: true,
        name: name
    });

    // Note that name is now in use
    namesUsed.push(name);


    return guestNumber + 1;
}

// room is a string
function joinRoom(socket, room) {
    socket.join(room);
    // User is now in the room
    currentRoom[socket.id] = room;

    // Let user know they are in a new room
    socket.emit('joinResult', {room: room});

    // let others know user has joined room
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + "."
    });

    // If other users exist, summarize
    var usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;

            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
            usersInRoomSummary += ".";

            socket.emit('message', {
                text: usersInRoomSummary
            });
        }
    }
}

// Set listeners on the socket for 'nameAttempt'
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    // Add listener to nameAttempt events
    socket.on('nameAttempt', function(name) {
        // Reject names that begin with Guest
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                name: name
            });
        } else { // If name is not taken
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                // Save index of current name
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;

                // Remove previous name to make it available to clients
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                //Broadcast event to everyone in the same room.
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' isnow known as ' + name + '.'
                })
            } else { // Error: name already in use
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                })

            }
        }
    })
}

// Take in a message event for the room, broadcast this message to everyone else in the same room
// Message object will contain a message and current room.
function handleMessageBroadcasting(socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ": " + message.text
        });
    });
}

// Creating or joining a room.
function handleRoomJoining(socket) {
    socket.on('join', function(room){
        // Leave the socket group
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room);
    });
}

// Handle disconnections when user leaves chat, free up names.
function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        // Free up the name of disconnected user
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}
