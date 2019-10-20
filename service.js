var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var app = express();

app.use(cors());

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/people', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

var humanSchema = new mongoose.Schema({
    gender: String,
    email: String,
    username: String,
    name: {
        title: String,
        first: String,
        last: String
    },
    fullName: String
});

var Human = mongoose.model('Human', humanSchema, 'users');

app.get('/', function (req, res) {
    res.send("Selam Millet @coderBora");
})

app.get("/people", function (req, res) {
    //res.send("Günaydın Millet");
    Human.find(function (err, doc) {
        doc.forEach(function (item) {
            item.fullName = item._doc.name.first + ' ' + item._doc.name.last;
        });
        res.send(doc);
    })
})

app.get("/peopleDesc", function (req, res) {
    //res.send("Günaydın Millet");
    Human.find()
        .sort('-_id')
        .exec(
            function (err, doc) {
                doc.forEach(function (item) {
                    item.fullName = item._doc.name.first + ' ' + item._doc.name.last;
                });
                res.send(doc);
            })
})

app.get("/getpeoplebyPaging/:page/:count", function (req, res) {
    //res.send("Günaydın Millet");    
    var page = parseInt(req.params.page) - 1;
    var rowCount = parseInt(req.params.count);
    var skip = page * rowCount;
    Human.find()
        .skip(skip)
        .limit(rowCount)
        .exec(
            function (err, doc) {
                if (doc != null) {
                    doc.forEach(function (item) {
                        item.fullName = item._doc.name.first + ' ' + item._doc.name.last;
                    });
                }
                res.send(doc);
            }
        )
})

app.get("/getpeopleByUsername/:name", function (req, res) {
    //res.send("Günaydın Millet");
    console.log(req)
    var query = { username: req.params.name };
    Human.find(query, function (err, doc) {
        doc.forEach(function (item) {
            item.fullName = item._doc.name.first + ' ' + item._doc.name.last;
        });
        res.send(doc);
    })
})
app.get("/getpeopleByLastname", function (req, res) {
    //res.send("Günaydın Millet");
    var query = { "name.last": req.query.lastname };
    Human.find(query, function (err, doc) {
        doc.forEach(function (item) {
            item.fullName = item._doc.name.first + ' ' + item._doc.name.last;
        });
        res.send(doc);
    })
})

app.get("/getpeopleContainsOrderTopWith/:name/:top", function (req, res) {
    //res.send("Günaydın Millet");
    var query = { "name.first": { $regex: req.params.name } };
    var top = parseInt(req.params.top);
    Human.find(query)
        .sort('-name.first')
        .skip(1)
        .limit(top)
        .exec(
            function (err, doc) {
                doc.forEach(function (item) {
                    item.fullName = item._doc.name.first + ' ' + item._doc.name.last;
                });
                res.send(doc);
            }
        )
})

app.get("/getpeopleStartsWith/:name", function (req, res) {
    //res.send("Günaydın Millet");
    var query = { "name.first": { $regex: '^' + req.params.name } };
    Human.find(query, function (err, doc) {
        doc.forEach(function (item) {
            item.fullName = item._doc.name.first + ' ' + item._doc.name.last;
        });
        res.send(doc);
    })
})

app.post('/insertPeople', async (req, res) => {
    console.log("req.body : " + req.body.username);
    console.log("req.body.last : " + req.body.name.last);
    try {
        var person = new Human(req.body);
        var result = await person.save();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post('/updatePeople', async (req, res) => {
    console.log("req.username : " + req.body.username);
    try {
        var updatePerson = new Human(req.body);
        const person = await Human.findOne({ username: updatePerson.username });
        await person.updateOne(updatePerson);
        /*  return res.send("succesfully saved"); */
        return true;
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post('/deletePeople', (req, res) => {
    console.log("req.username : " + req.body.username);
    try {
        var deletePerson = new Human(req.body);
        Human.findOneAndRemove({ username: deletePerson.username })
            .then(function (doc) {
                if (doc) {          
                    //return res.send("succesfully delete");
                    return res.status(200).json({ status: "succesfully delete" });
                }
                else
                {                    
                    return res.send("no document found!");
                }
            }).catch(function (error) {
                throw error;
            });
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(9480);

/* mongoimport--db people--collection users--jsonArray users.js */