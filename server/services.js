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
        const notes = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        const newNote = {
            id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1, // Generate new ID maping the highest ID in the array and adding 1
            title: req.body.title,
            content: req.body.content,
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

module.exports = {
    getNotes,
    addNote
};