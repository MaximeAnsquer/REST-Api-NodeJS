let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let ContactModel = require('./db').contactModel;
let addContact = require('./db').addContact;
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.options('*', cors());

app.get('/contacts', (req, res) => {
    ContactModel.find().exec((err, result) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(result, null, 2));
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
    let contact = addContact(req.body.firstName, req.body.lastName, req.body.description);
    res.status(201).send(JSON.stringify(contact, null, 2));
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
        'lastName': req.body.lastName,
        'description': req.body.description
    };
    ContactModel.findOneAndUpdate(query, newData, function( err ) {
        let status = err ? 404 : 204;
        res.status(status).send();
    });
});

app.post('/addFakeData', (req, res) => {
    let fakeContacts = [
        {
            "firstName": "Stephen",
            "lastName": "Mc Stephenson",
            "description": "Mon pote américain"
        },
        {
            "firstName": "Patrick",
            "lastName": "Balkani",
            "description": "Un mec moche"
        },
        {
            "firstName": "Johnny",
            "lastName": "Depp",
            "description": "Un mec qui fait une pub de merde pour du parfum"
        },
        {
            "firstName": "Stéphanie",
            "lastName": "De Monaco",
            "description": "Stéphanie Marie Élisabeth Grimaldi, princesse de Monaco, née le 1ᵉʳ février 1965 à Monaco, est un membre de la famille princière monégasque."
        },
        {
            "firstName": "Jean-Émile",
            "lastName": "Pétochard",
            "description": "Un mec qui a un nom rigolo"
        }
    ];
    fakeContacts.forEach(function(contact) {
        addContact(contact.firstName, contact.lastName, contact.description);
    });
    res.status(201).send();
});

module.exports = { 'app': app };