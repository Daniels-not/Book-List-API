const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookSchema = new schema({
    name: String,
    gender: String,
    authorID: Number
});

module.exports = mongoose.module("Books", bookSchema);