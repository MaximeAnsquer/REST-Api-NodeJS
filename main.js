let mongoose = require('mongoose');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

mongoose.connect('mongodb://127.0.0.1/myDatabase');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connection réussie.");
    let contactSchema = mongoose.Schema(
        {
            first_name: String,
            last_name: String
        },
        {
            versionKey: false  //hides the "__v" attribute
        });
    let ContactModel = mongoose.model('contact', contactSchema);

    function addContact(first_name, last_name) {
        let contact = new ContactModel({
            "first_name": first_name,
            "last_name": last_name
        });
        contact.save();
        return JSON.stringify(
            {
                "first_name": first_name,
                "last_name": last_name,
                "links": [
                    {
                        "rel": "self",
                        "href": "http://localhost:3000/contacts/" + contact.id
                    }
                ]
            },
            null, 2
        );
    }

    function deleteContact(target_id) {
        return ContactModel.findOne({_id: target_id}).remove().exec();
    }

    app.get('/contacts', (req, res) => {
        ContactModel.find().exec((err, results) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(results, null, 2));
        });
    });

    app.get('/contacts/:id', (req, res) => {
        ContactModel.findOne({_id: req.params.id}).exec((err, result) => {
            res.setHeader('Content-Type', 'application/json');
            result ? res.status(200).send(JSON.stringify(result, null, 2)) : res.status(404).send();
        });
    });

    app.post('/contacts', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(addContact(req.body.first_name, req.body.last_name));
    });

    app.delete('/contacts/:id', (req, res) => {
        ContactModel.remove({_id: req.params.id}, (err, removeResult) => {
            let status = removeResult.result.n ? 204 : 404;
            res.status(status).send();
        });
    });

    app.listen(3000, function () {
        console.log('http://localhost:3000/contacts/');
    });

});
