let app = require('./routes').app;
let db = require('./db').db;

db.once('open', function () {
    console.log('Connection réussie.');

    app.listen(3000, function () {
        console.log('http://localhost:3000/contacts/');
    });

});