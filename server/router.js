
const express = require('express');
const router = express.Router();
const services = require('./services');
const path = require('path');

router.get('/', (req, res) => {
    // Use absolute path to client directory
    res.sendFile(path.join(__dirname, '../client/notelab.html'));
});

router.get('/notes', services.getNotes);
router.post('/notes', services.addNote);
router.delete('/notes/:id', services.deleteNote);

module.exports = router;