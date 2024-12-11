const { ObjectId } = require('mongodb');
const { getDb, COLLECTIONS } = require('./config/db');

async function getNotes(req, res) {
    try {
        // Parse pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get paginated notes with sorting
        const notes = await getDb()
            .collection(COLLECTIONS.NOTES)
            .find({})
            .sort({ dateCreated: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count for pagination
        const total = await getDb()
            .collection(COLLECTIONS.NOTES)
            .countDocuments();

        res.json({
            notes,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalNotes: total
        });
    } catch (err) {
        console.error('Error reading notes:', err);
        res.status(500).json({ error: 'Error reading notes' });
    }
}

async function addNote(req, res) {
    try {
        // Validate required fields
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({
                error: 'Title and content are required fields'
            });
        }

        // Process tags: split by comma, trim whitespace, remove empty tags
        const tags = req.body.tags ?
            req.body.tags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0) :
            [];

        // Create note document
        const note = {
            title: req.body.title,
            content: req.body.content,
            dateCreated: new Date(),
            tags: tags
        };

        // Insert note into database
        const result = await getDb()
            .collection(COLLECTIONS.NOTES)
            .insertOne(note);

        // Return created note with its ID
        res.status(201).json({
            ...note,
            _id: result.insertedId
        });
    } catch (err) {
        console.error('Error saving note:', err);
        res.status(500).json({ error: 'Error saving note' });
    }
}

async function deleteNote(req, res) {
    try {
        // Validate ID format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid note ID format'
            });
        }

        // Attempt to delete the note
        const result = await getDb()
            .collection(COLLECTIONS.NOTES)
            .deleteOne({ _id: new ObjectId(req.params.id) });

        // Check if note was found and deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: 'Note not found'
            });
        }

        res.status(200).json({
            message: 'Note deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ error: 'Error deleting note' });
    }
}

// New function to get a single note by ID
async function getNoteById(req, res) {
    try {
        // Validate ID format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid note ID format'
            });
        }

        // Find the note
        const note = await getDb()
            .collection(COLLECTIONS.NOTES)
            .findOne({ _id: new ObjectId(req.params.id) });

        // Check if note exists
        if (!note) {
            return res.status(404).json({
                error: 'Note not found'
            });
        }

        res.json(note);
    } catch (err) {
        console.error('Error finding note:', err);
        res.status(500).json({ error: 'Error finding note' });
    }
}

// New function to update a note
async function updateNote(req, res) {
    try {
        // Validate ID format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid note ID format'
            });
        }

        // Validate required fields
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({
                error: 'Title and content are required fields'
            });
        }

        // Process tags
        const tags = req.body.tags ?
            req.body.tags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0) :
            [];

        // Create update document
        const updatedNote = {
            title: req.body.title,
            content: req.body.content,
            tags: tags,
            lastModified: new Date()
        };

        // Update the note
        const result = await getDb()
            .collection(COLLECTIONS.NOTES)
            .updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updatedNote }
            );

        // Check if note was found and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Note not found'
            });
        }

        res.json({
            message: 'Note updated successfully',
            note: {
                _id: req.params.id,
                ...updatedNote
            }
        });
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ error: 'Error updating note' });
    }
}

module.exports = {
    getNotes,
    getNoteById,
    addNote,
    updateNote,
    deleteNote
};