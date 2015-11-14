/**
 * Created by dennis on 11/13/15.
 */
var socketio = require('socket.io');


var io;
var guestNumber;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};


exports.listen = function(server) {

    // Start socketio server, allowing it to piggy back off existing HTTP server
    io = socketio.listen(server);
    io.set('log level', 1);

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