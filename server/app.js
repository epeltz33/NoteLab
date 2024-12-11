
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const router = require('./router');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB before starting server
connectDB().then(() => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../client')));
    app.use('/', router);

    app.listen(port, () => {
        console.log(`NoteLab server running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});