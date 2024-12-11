
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'notelab';

// Define collections as constants
const COLLECTIONS = {
    NOTES: 'notes'
};

let db;

async function connectDB() {
    try {
        const client = await MongoClient.connect(url);
        db = client.db(dbName);

        // Create indexes after establishing connection
        // -1 for descending order, 1 for ascending order
        await db.collection(COLLECTIONS.NOTES).createIndex({ title: 1 });
        await db.collection(COLLECTIONS.NOTES).createIndex({ dateCreated: -1 });

        console.log('Connected to MongoDB');
        console.log('Indexes created successfully');
        return db;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

function getDb() {
    return db;
}

module.exports = { connectDB, getDb, COLLECTIONS };