const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils');

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
//app.get('/notes', (req, res) =>
  //res.sendFile(path.join(__dirname, '/public/notes.html'))
//);


// GET API route to retrieve notes
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting a note
app.post('/api/notes', (req, res) => {
    
    // Destructing items in req.body
    const { title, text } = req.body;
    
    //Get a unque id for the note
    const id = uuidv4();

    // If title and text properties are present
    if (title && text) {
        
        // Create new note object
        const newNote = {
            id,
            title,
            text,
        };

        //Save the new note to the db.json file if no eorr
        readAndAppend(newNote, './db/db.json');

        res.status(200).json(`Note added successfully`);
		//
	} else {
		
		res.status(400).error('Eorr in posting a note');
	}
        
});

// Delete Route
app.delete('/api/notes/:id', (req, res) => {

    //Get the id for the note that needs to be deleted
    const id = req.params.id;

    // If the id is passed
    if (id && id != "" && id != undefined) {
        const dir = path.join(__dirname, '/db/db.json');
        readFromFile(dir).then((data) => {
        
    //Parse the json file to get an array of the note objects
        const editedFile = JSON.parse(data);

        //Loop through to find note array with matching id
            editedFile.forEach((item, index, array) => {
                if (item.id === id) {

                    //Remove the matching note from the array
                    array.splice(index, 1);
                }
            })

            //Save edited file
            writeToFile(dir, editedFile);
            res.status(200).json(`Note: ${id} has been deleted successfully`);
            
            
    });
    }
});

// Wildcard route to direct all other get requests to the home html page
//app.get('*', (req, res) =>
    //res.sendFile(path.join(__dirname, 'public/index.html'))
//);





app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);






