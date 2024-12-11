const express = require('express');
const router = express.Router();
const services = require('./services');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/notelab.html'));
});

router.get('/browse-data', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/browse-data.html'));
});

// API Routes
router.get('/notes', services.getNotes);
router.get('/notes/:id', services.getNoteById);
router.post('/notes', services.addNote);
router.put('/notes/:id', services.updateNote);
router.delete('/notes/:id', services.deleteNote);

module.exports = router;