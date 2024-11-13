const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'files', 'notes.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '[]');
}

function getNotes(req, res) {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Error reading notes' });
    }
}

function addNote(req, res) {
    try {
        // Read the notes from the file  and parse the JSON
        const notes = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        const newNote = {
            // Generate a new ID by incrementing the last note's ID
            id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
            title: req.body.title,
            content: req.body.content,
            //  'T' stands for time, so we split at 'T' to get only the date part of the ISO string
            dateCreated: new Date().toISOString().split('T')[0],
            tags: req.body.tags.split(',').map(tag => tag.trim())
        };

        notes.push(newNote);
        fs.writeFileSync(dataFile, JSON.stringify(notes, null, 2));
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ error: 'Error saving note' });
    }
}

function deleteNote(req, res) {
    try {
        const noteId = parseInt(req.params.id);
        let notes = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

        // Filter out the note with the specified ID
        const filteredNotes = notes.filter(note => note.id !== noteId);

        // If the length hasn't changed, the note wasn't found
        if (filteredNotes.length === notes.length) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Write the filtered notes back to the file
        fs.writeFileSync(dataFile, JSON.stringify(filteredNotes, null, 2));
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting note' });
    }
}

module.exports = {
    getNotes,
    addNote,
    deleteNote
};