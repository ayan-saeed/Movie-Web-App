// Imports the Mongoose library into file
const mongoose = require('mongoose');

// Defined schema - a template for how each record in Mangodb collection should look
const wishlistSchema = new mongoose.Schema({
    // 'unique' prevents duplicates in wishlist
    movieId: { type: Number, required: true, unique: true },
    title: String,
    poster: String
});

// Creates and exports a Mongoose model based on the schema
module.exports = mongoose.model('Wishlist', wishlistSchema);
