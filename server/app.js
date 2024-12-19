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

// Define routes for clean URLs
const routes = {
    '/': 'notelab.html',
    '/write': 'write-data.html',
    '/view': 'view-data.html',
    '/browse': 'browse-data.html'
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// Initialize database connection before starting server
initializeDatabase().then(() => {
    // CORS Configuration with more secure options
    app.use(cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 600 // Cache preflight requests for 10 minutes
    }));

    // Middleware setup
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Security middleware
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });

    // Serve static files from client directory
    app.use(express.static(path.join(__dirname, '../client')));

    // API Routes - should come before the catch-all route
    services(app);

    // Clean URL routing
    Object.keys(routes).forEach(route => {
        app.get(route, (req, res) => {
            res.sendFile(path.join(__dirname, '../client', routes[route]));
        });
    });

    // SPA-style catch-all route for client-side routing
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/notes')) {
            return next();
        }

        // Check if requesting a specific HTML file
        if (req.path.endsWith('.html')) {
            const filePath = path.join(__dirname, '../client', req.path);
            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            }
        }

        // Default to serving the main HTML file
        res.sendFile(path.join(__dirname, '../client/notelab.html'));
    });

    // Error handling middleware should be last
    app.use(errorHandler);

    // Start the server
    app.listen(port, () => {
        console.log(`NoteLab server running at http://localhost:${port}`);
        console.log('\nAvailable routes:');
        console.log('----------------');
        Object.keys(routes).forEach(route => {
            console.log(`${route} -> ${routes[route]}`);
        });
        console.log('\nAPI endpoints:');
        console.log('-------------');
        console.log('GET    /notes            - Get all notes');
        console.log('POST   /notes            - Create new note');
        console.log('GET    /notes/type/:type - Get notes by type');
        console.log('PUT    /notes/:id        - Update note');
        console.log('DELETE /notes/:id        - Delete note');
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Performing graceful shutdown...');
    server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason, promise) => { // this is needed to catch unhandled promise rejections
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});