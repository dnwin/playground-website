/**
 * Created by Dennis on 11/21/2015.
 */
/**
 * This will demonstrate parallel flow control.
 * In order to execute a number of asynchronous tasks in parallel, you again need to put the
 * tasks in an array, but this time the order of the tasks is unimportant. Each task should call a
 * handler function that will increment the number of completed tasks. When all tasks are
 * complete, the handler function should perform some subsequent logic.
 *
 */
var fs = require('fs');
var completedTasks = 0;
var tasks = []; // Number of tasks that needs to be completed in parallel.
var wordCounts = {}; // Dictionary to hold  words : count
var filesDir = './text';


/**
 * When all tasks have completed.
 * List each word used in the files and how many times it was used
 */
function checkIfComplete() {
    completedTasks++;
    // If all tasks are complete
    if (completedTasks == tasks.length) {
        for (var index in wordCounts) {
            console.log(index + ": " + wordCounts[index]);
        }
    }
}

/**
 * Count word occurences in text.
 * @param text - text file
 */
function countWordsInText(text) {

    // File to string, to lower case, split by words, sort in order.
    var words = text
        .toString()
        .toLowerCase()
        .split(/\W+/)
        .sort();
    for (var index in words) {
        // Get each word
        var word = words[index];
        if (word) {
            // Check if word already exists then increment.
            wordCounts[word] =
                (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

// Get list of files in the text directory.
fs.readdir(filesDir, function(err, files) {
    if (err) throw err;
    for (var index in files) {

        // Define a task to handle each file.
        var task = (function(file) {
            return function() {
                fs.readFile(file, function(err, data){
                    if (err) throw err;
                    countWordsInText(data);
                    checkIfComplete();
                });
            };
        })(filesDir + '/' + files[index]);
        tasks.push(task);
    }

    // Execute every task in parallel.
    for (var task in tasks) {
        tasks[task]();
    }
});
