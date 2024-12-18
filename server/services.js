const { MongoClient, ObjectId } = require('mongodb');

const dbURL = process.env.DB_URI || "mongodb://127.0.0.1:27017";
const dbName = "notelab";
const client = new MongoClient(dbURL, { useUnifiedTopology: true });

var services = function(app) {
    // Debug endpoint to test API
    app.get('/api-test', (req, res) => {
        res.json({ msg: "API is working" });
    });

    // GET: Retrieve all notes
    app.get('/notes', async function(req, res) {
        console.log('GET /notes - Retrieving all notes'); // Debug log

        try {
            const conn = await client.connect();
            const db = conn.db(dbName);
            const notes = await db.collection('notes')
                .find({})
                .sort({ dateCreated: -1 })
                .toArray();

            console.log(`Found ${notes.length} notes`); // Debug log

            await conn.close();
            return res.json({
                msg: "SUCCESS",
                notes: notes
            });
        } catch(err) {
            console.error('Database error:', err); // Error log
            await client.close();
            return res.status(500).json({
                msg: "Error: " + err.message
            });
        }
    });

    // GET: Retrieve notes by type
    app.get('/notes/type/:type', async function(req, res) {
        console.log(`GET /notes/type/${req.params.type}`); // Debug log

        try {
            const conn = await client.connect();
            const db = conn.db(dbName);
            const notes = await db.collection('notes')
                .find({ type: req.params.type })
                .sort({ dateCreated: -1 })
                .toArray();

            console.log(`Found ${notes.length} notes of type ${req.params.type}`); // Debug log

            await conn.close();
            return res.json({
                msg: "SUCCESS",
                notes: notes
            });
        } catch(err) {
            console.error('Database error:', err);
            await client.close();
            return res.status(500).json({
                msg: "Error: " + err.message
            });
        }
    });

    // POST: Add a new note
    app.post('/notes', async function(req, res) {
        console.log('POST /notes - Adding new note:', req.body); // Debug log

        if (!req.body.title || !req.body.content || !req.body.type) {
            return res.status(400).json({
                msg: "Title, content, and type are required fields"
            });
        }

        const note = {
            title: req.body.title,
            type: req.body.type,
            content: req.body.content,
            dateCreated: new Date(),
            tags: req.body.tags || []
        };

        try {
            const conn = await client.connect();
            const db = conn.db(dbName);
            const result = await db.collection('notes').insertOne(note);

            console.log('Note added successfully:', result.insertedId); // Debug log

            await conn.close();
            return res.status(201).json({
                msg: "SUCCESS",
                note: { ...note, _id: result.insertedId }
            });
        } catch(err) {
            console.error('Database error:', err);
            await client.close();
            return res.status(500).json({
                msg: "Error: " + err.message
            });
        }
    });

    // PUT: Update a note
    app.put('/notes/:id', async function(req, res) {
        console.log(`PUT /notes/${req.params.id}`, req.body); // Debug log

        try {
            const conn = await client.connect();
            const db = conn.db(dbName);
            const result = await db.collection('notes').updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: {
                    title: req.body.title,
                    type: req.body.type,
                    content: req.body.content,
                    tags: req.body.tags || []
                }}
            );

            console.log('Update result:', result); // Debug log

            await conn.close();
            return res.json({
                msg: "SUCCESS",
                result: result
            });
        } catch(err) {
            console.error('Database error:', err);
            await client.close();
            return res.status(500).json({
                msg: "Error: " + err.message
            });
        }
    });

    // DELETE: Remove a note
    app.delete('/notes/:id', async function(req, res) {
        console.log(`DELETE /notes/${req.params.id}`); // Debug log

        try {
            const conn = await client.connect();
            const db = conn.db(dbName);
            const result = await db.collection('notes').deleteOne({
                _id: new ObjectId(req.params.id)
            });

            console.log('Delete result:', result); // Debug log

            await conn.close();
            return res.json({
                msg: "SUCCESS",
                result: result
            });
        } catch(err) {
            console.error('Database error:', err);
            await client.close();
            return res.status(500).json({
                msg: "Error: " + err.message
            });
        }
    });
};

var initializeDatabase = async function() {
    try {
        console.log('Connecting to MongoDB...'); // Debug log
        const conn = await client.connect();
        const db = conn.db(dbName);

        // Create indexes
        await db.collection('notes').createIndex({ dateCreated: -1 });
        await db.collection('notes').createIndex({ type: 1 });

        // Test the connection by counting notes
        const count = await db.collection('notes').countDocuments();
        console.log(`Connected to MongoDB. Found ${count} notes.`); // Debug log

        await conn.close();
    } catch(err) {
        console.error('Database initialization error:', err);
        throw err;
    }
};

module.exports = { services, initializeDatabase };