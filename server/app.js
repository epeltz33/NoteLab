// Required module imports
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { services, initializeDatabase } = require('./services');

// Create Express application instance
const app = express();
const port = 3000;

// Initialize database connection before starting server
initializeDatabase().then(() => {
    // CORS Configuration
    app.use(cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000'],
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Middleware setup
    app.use(bodyParser.json());  // Parse JSON request bodies

    // Important: Set up API routes BEFORE static file serving
    services(app);

    // Static file serving
    app.use(express.static(path.join(__dirname, '../client')));

    // Serve notelab.html at the root path
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/notelab.html'));
    });

    // Only apply catch-all route to non-API routes
    app.get('*', (req, res, next) => {
        // Skip this middleware if it's an API request
        if (req.path.startsWith('/notes')) {
            return next();
        }

        const filePath = path.join(__dirname, '../client', req.path);
        if (req.path.endsWith('.html') && fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.sendFile(path.join(__dirname, '../client/notelab.html'));
        }
    });

    // Start the server
    app.listen(port, () => {
        console.log(`NoteLab server running at http://localhost:${port}`);
        console.log('API endpoints available at:');
        console.log('  GET    /notes');
        console.log('  POST   /notes');
        console.log('  GET    /notes/type/:type');
        console.log('  DELETE /notes/:id');
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});