const mongoose = require('mongoose');
const schema = mongoose.Schema;

const authorSchema = new schema({
    name: String,
    age: Number
});

module.export = mongoose.module("Author", authorSchema);