// Configuration of Mongo DB


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Aubergine-API-Implementation');
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error in Connecting"));

db.once('open', function()
{
    console.log("Connected to Database:: MongoDB");
});

module.exports = db;