require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// Imports Mongoose model
const Wishlist = require('./models/Wishlist');
// Creates an Express app instance
const app = express();

// Allows requests from my frontend
app.use(cors());
app.use(bodyParser.json());

// Tells Mongoose to connect to my MongoDB Atlas cluster
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Get all wishlist movies
app.get('/wishlist', async (req, res) => {
    // Returns an array of all saved movies
    const wishlist = await Wishlist.find();
    // Sends the array back to client as JSON
    res.json(wishlist);
});

/* When my frontend does a POST request to /wishlist, this route runs.
   It reads the movie data from req.body, and creates a new document in MongoDB with new Wishlist(req.body).
   Then it save it to the database with await movie.save()*/
app.post('/wishlist', async (req, res) => {
    try {
        const movie = new Wishlist(req.body);
        await movie.save();
        res.json({ success: true, movie });
    } catch (err) {
        if (err.code === 11000) {
            return res.json({ success: false, message: 'Movie already in wishlist' });
        }
        res.status(500).json(err);
    }
});

/* Removes the movie that matches that ID in MongoDB */
app.delete('/wishlist/:id', async (req, res) => {
    const movieId = req.params.id;
    await Wishlist.deleteOne({ movieId });
    res.json({ success: true });
});

// Tells Express to start listening for incoming requests on port 3000
app.listen(3000, () => console.log('Server running on http://localhost:3000'));