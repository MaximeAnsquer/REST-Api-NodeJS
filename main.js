let mongoose = require('mongoose');
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.options('*', cors());

mongoose.connect('mongodb://127.0.0.1/myDatabase');
let db = mongoose.connection;
db.once('open', function () {
    console.log('Connection réussie.');
    let model = {
        firstName: String,
        lastName: String
    };
    let contactSchema = mongoose.Schema(model, {versionKey: false});
    let ContactModel = mongoose.model('contact', contactSchema);

    function addContact(firstName, lastName) {
        let contact = new ContactModel({
            'firstName': firstName,
            'lastName': lastName
        });
        contact.save();
        return contact;
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
            if (result) {
                res.status(200).send(JSON.stringify(result, null, 2));
            } else {
                res.status(404).send();
            }
        });
    });

    app.post('/contacts', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let contact = addContact(req.body.firstName, req.body.lastName);
        let returnedData = {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'links': [
                {
                    'rel': 'self',
                    'href': 'http://localhost:3000/contacts/' + contact.id
                }
            ]
        };
        res.status(201).send(JSON.stringify(returnedData, null, 2));
    });

    app.delete('/contacts/:id', (req, res) => {
        ContactModel.remove({_id: req.params.id}, (err, removeResult) => {
            let status = removeResult.result.n ? 204 : 404;
            res.status(status).send();
        });
    });

    app.put('/contacts/:id', (req, res) => {
        let query = {'_id': req.params.id};
        let newData = {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName
        };
        ContactModel.findOneAndUpdate(query, newData, {upsert: true}, function( err ) {
            let status = err ? 404 : 204;
            res.status(status).send();
        });
    });

    app.post('/addFakeData', (req, res) => {
        let fakeContacts = [
            {
                "firstName": "Stephen",
                "lastName": "Mc Stephenson"
            },
            {
                "firstName": "Patrick",
                "lastName": "Balkani"
            },
            {
                "firstName": "Johnny",
                "lastName": "Depp"
            },
            {
                "firstName": "Stéphanie",
                "lastName": "De Monaco"
            },
            {
                "firstName": "Jean-Émile",
                "lastName": "Pétochard"
            }
        ];
        fakeContacts.forEach(function(contact) {
            addContact(contact.firstName, contact.lastName);
        });
        res.status(201).send();
    });

    app.listen(3000, function () {
        console.log('http://localhost:3000/contacts/');
    });

});
