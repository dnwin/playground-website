/**
 * Created by dennis on 11/24/15.
 */
var sqlite3 = require('sqlite3').verbose();
var dbName = 'tldr.sqlite';

var db = new sblite3.Database(dbName);

module.exports = db;
module.exports.Article = Article;

db.serialize(function() {
    var sql = "CREATE TABLE IF NOT EXISTS articles";
    sql += ' (id integer primary key, title, content TEXT)\n';
    db.run(sql);


});

function Article() {

}

Article.all = function(cb) {
    db.all('SELECT * from articles', cb);

}

Article.find = function(id, cb) {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb);
}

Article.create = function(data, cb) {
    var sql = 'INSERT INTO articles(title, content) VALUES (?, ?)';
    db.run(sql, data.title, data.content, cb);
}

Article.delete = function(id, cb) {
    if (!id) return cb(new Error('Please provide an id'));
    db.run('DELETE FROM articles WHERE id = ?', id, cb);
}