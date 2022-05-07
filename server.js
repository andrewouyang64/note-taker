const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');

const PORT = process.env.PORT || 3001;
const app = express();

// Import clog middleware
app.use(clog);

// Middleware for parsing JSON and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//For all files in public directory
app.use(express.static('public'));


// GET Route for html page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))

);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// GET API route to retrieve notes
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);






app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);






