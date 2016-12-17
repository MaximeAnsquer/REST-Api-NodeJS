let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/myDatabase');
let db = mongoose.connection;

let model = {
    firstName: String,
    lastName: String,
    description: String
};
let contactSchema = mongoose.Schema(model, {versionKey: false});
let ContactModel = mongoose.model('contact', contactSchema);

function addContact(firstName, lastName, description) {
    let contact = new ContactModel({
        'firstName': firstName,
        'lastName': lastName,
        'description': description
    });
    contact.save();
    return contact;
}

module.exports = { 'contactModel': ContactModel, 'addContact': addContact, 'db': db };


