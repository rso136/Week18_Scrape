var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var request = require('request');
var cheerio = require('cheerio');


app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(express.static('public'));


//mongoose.connect('mongodb://localhost/nycproject');
mongoose.connect('mongodb://heroku_j93dj1bt:innf76849aevppl6gk24h0hdmb@ds029436.mlab.com:29436/heroku_j93dj1bt');
var db = mongoose.connection;


db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});


db.once('open', function() {
    console.log('Mongoose connection successful.');
});


var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

app.get('/', function(req, res) {
    res.send(index.html);
});


app.get('/scrape', function(req, res) {

    request('http://www.nycfc.com/news', function(error, response, html) {

        var $ = cheerio.load(html);

        $('div.node-title > a').each(function(i, element) {

            var title = $(this).text();
            var link = $(element).attr('href');
            Article.findOne({
                title: title,
                link: link
            }, function(err, article) {
                if (!article) {

					var result = {};

				    result.title = title;
                    result.link = link;

					var entry = new Article(result);

					entry.save(function(err, doc) {

                        if (err) {
                            console.log(err);
                        } else {

                            console.log(doc);
                        }
                    });
				}
            })

        });
    });

    res.send("Scrape Complete");
});


app.get('/articles', function(req, res) {

    Article.find({}, function(err, doc) {

        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

app.get('/ratings', function(req, res) {
    Article.find({})
        .sort({ rating: -1 })
        .limit(5)
        .exec(function(err, doc) {

            if (err) {
                console.log(err);
            } else {
                res.json(doc);
            }
        })

})


app.get('/articles/:id', function(req, res) {

    Article.findOne({ '_id': req.params.id })

    .populate('note')

    .exec(function(err, doc) {

        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});


app.post('/articles/:id', function(req, res) {

    var newNote = new Note(req.body);


    newNote.save(function(err, doc) {

        if (err) {
            console.log(err);
        } else {

            Article.findOneAndUpdate({ '_id': req.params.id }, { 'note': doc._id })

            .exec(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {

                    res.send(doc);
                }
            });
        }
    });
});

app.post('/update/:id/:rating', function(req, res) {
    Article.findOneAndUpdate({ '_id': req.params.id }, { 'rating': req.params.rating })

    .exec(function(err, doc) {

        if (err) {
            console.log(err);
        } else {
            res.send(doc);
        }
    })
});



// listen on port 3000
app.listen(3000, function() {
    console.log('App running on port 3000!');
});
