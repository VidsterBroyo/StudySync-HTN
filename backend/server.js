const express = require('express');
const { MongoClient } = require('mongodb');
var cors = require('cors')
const app = express();
const port = 3001;

// Connection URL
const url = 'mongodb+srv://vidsterbroyo:VoeyVtqp750W39aR@studybuddymongo.ny5sq.mongodb.net/?retryWrites=true&w=majority&appName=StudyBuddyMongo';
const dbName = 'StudyGroupLectures';

// Middleware to parse JSON
app.use(express.json());


app.use(cors())

// Route to get all documents from a collection based on groupName
app.get('/lectures/:groupName', async (req, res) => {
    const { groupName } = req.params;

    if (!groupName) {
        return res.status(400).json({ error: 'Group name is required' });
    }

    let client;

    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection(groupName); // Access collection with name = groupName

        const documents = await collection.find({}).toArray();
        
        if (documents.length === 0) {
            return res.status(404).json({ message: 'No documents found' });
        }

        res.json(documents);
    } catch (error) {
        console.error('Error accessing MongoDB:', error);
        res.status(500).json({ error: 'An error occurred while accessing the database' });
    } finally {
        if (client) {
            client.close();
        }
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




