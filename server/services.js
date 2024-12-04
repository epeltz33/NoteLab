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
        console.error('Error reading notes:', err);
        res.status(500).json({ error: 'Error reading notes' });
    }
}

function addNote(req, res) {
    try {
        const notes = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

        // Handle tags properly - ensure it's not undefined
        let tags = [];
        if (req.body.tags) {
            tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }

        const newNote = {
            id: notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 1,
            title: req.body.title,
            content: req.body.content,
            dateCreated: new Date().toISOString().split('T')[0],
            tags: tags
        };

        notes.push(newNote);
        fs.writeFileSync(dataFile, JSON.stringify(notes, null, 2));
        res.status(201).json(newNote);
    } catch (err) {
        console.error('Error saving note:', err);
        res.status(500).json({ error: 'Error saving note' });
    }
}

function deleteNote(req, res) {
    try {
        const noteId = parseInt(req.params.id);
        let notes = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

        const filteredNotes = notes.filter(note => note.id !== noteId);

        if (filteredNotes.length === notes.length) {
            return res.status(404).json({ error: 'Note not found' });
        }

        fs.writeFileSync(dataFile, JSON.stringify(filteredNotes, null, 2));
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ error: 'Error deleting note' });
    }
}

module.exports = {
    getNotes,
    addNote,
    deleteNote
};