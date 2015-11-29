/**
 * Created by Dennis on 11/28/2015.
 */

// Defines helper functions for sending web
// page html and receiving data through forms
var qs = require('querystring');

/**
 * ADDING DATA WITH SQL
 */


exports.show = function(db, res, showArchived) {
    var query = "SELECT * FROM work " +
        "WHERE archived=?" +
        " ORDER BY date DESC";
    var archiveValue = (showArchived) ? 1 : 0;

    db.query(
        query,
        [archiveValue],
        function(err, rows) {
            if (err) throw err;
            html = (showArchived)
                ? ''
                : '<a href="/archived">Archived Work</a><br/>';
            html += exports.workHitlistHtml(rows);
            html += exports.workFormHtml();
            exports.sendHtml(res, html);
        }
    );
};

exports.showArchived = function(db, res) {
    exports.show(db, res, true);
};

exports.add = function(db, req, res) {
    // Parse http post data
    exports.parseReceivedData(req, function(work) {
        db.query("INSERT INTO work (hours, date, description) " +
            "VALUES (?, ?, ?)",
            [work.hours, work.date, work.description]),
            function(err) {
                if (err) throw err;
                exports.show(db, res);
            }
    })
};

exports.delete = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
        db.query("DELETE FROM work WHERE id=?",
            [work.id],
            function (err) {
                if (err) throw err;
                exports.show(db,res);
            }
        )
    });
};





/**
 * HELPER FUNCTIONS
 */


// Display HTML table using row data
exports.workHitlistHtml = function(rows) {
    var html = '<table>';
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        html += '<tr>';
        html += '<td>' + row.date + '</td>';
        html += '<td>' + row.hours + '</td>';
        html += '<td>' + row.description + '</td>';
        if (!row.archived) {
            html += '<td>' + exports.workArchiveForm(row.id) + '</td>';
        }
        html += '<td>' + exports.workDeleteForm(rows.id) + '</td>';
        html += '</tr>'
    }
    html += '</table>';
    return html;
};
exports.workFormHtml = function() {
    var html = '<form method="POST" action="/">' +
    '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>' +
    '<p>Hours worked:<br/><input name="hours" type="text"><p/>' +
    '<p>Description:<br/>' +
    '<textarea name="description"></textarea></p>' +
    '<input type="submit" value="Add" />' +
            '<p> hello </p>' +
    '</form>';
    return html;
};
exports.workArchiveForm = function(id) {
    return exports.actionForm(id, '/archive', 'Archive');
};
exports.workDeleteForm = function(id) {
    return exports.actionForm(id, '/delete', 'Delete');
};



// Send HTML response
exports.sendHtml = function(res, html) {
    res.setHeader('Content-Type', html);
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
};

// Parse HTTP POST data
exports.parseReceivedData = function(req, cb) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { body += chunk });
    req.on('end', function() {
        var data = qs.parse(body);
        cb(data);
    })
};

// Render simple form data
exports.actionForm = function(id, path, label) {
    var html = '<form method="POST" action="' + path + '">' +
        '<input type="hidden" name="id" value="' + id + '">' +
        '<input type="submit" value="' + label + '" />' +
        '</form>';
    return html;
};



