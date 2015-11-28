/**
 * Created by Dennis on 11/27/2015.
 */
// Grab commands from CLI
var fs = require('fs');
var path = require('path');

// get cli input
var args = process.argv;
args = args.splice(2);

// Get first command
var command = args.shift();

// Get rest of args/description.
var taskDescription = args.join(' ');

// Resolve database path relative to current working dir
var file = path.join(process.cwd(), './tasks');

switch (command) {
    case 'list':
        listTasks(file);
        break;
    case 'add':
        addTask(file, taskDescription);
        break;
    default:
        console.log('Usage: ' + process.argv[0]
            + ' list|add [taskDescription]');
}

function addTask(file, taskDescription) {
    // Get current task array
    loadOrInitializeTaskArray(file, function(tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    })
}

// Helper - Store tasks
function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved.');
    });
}

// Lists all tasks
function listTasks(file) {
    loadOrInitializeTaskArray(file, function(tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            console.log(task);
        }
    });
}
// Load array from file or initialize empty array
function loadOrInitializeTaskArray(file, cb) {
    // Check if tasks file already exists
    fs.exists(file, function(exists) {
        var tasks = [];
        if (exists) {
            // Read from .tasks file
            fs.readFile(file, 'utf8', function(err, data) {
                if (err) throw err;
                var data = data.toString();
                var tasks = JSON.parse(data || '[]');
                cb(tasks);
            })
        } else {
            cb([]);
        }
    });

}