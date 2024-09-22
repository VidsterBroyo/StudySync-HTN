const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
// const fetch = require('node-fetch'); // Ensure fetch is imported

require('dotenv').config();

const app = express();
const port = 3001;

// Connection URL
const url = 'mongodb+srv://vidsterbroyo:VoeyVtqp750W39aR@studybuddymongo.ny5sq.mongodb.net/?retryWrites=true&w=majority&appName=StudyBuddyMongo';
const dbName = 'StudyGroupLectures';

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

const { ManagementClient } = require('auth0');

const clientId = process.env.AUTH0_MANAGEMENT_CLIENT_ID;
const clientSecret = process.env.AUTH0_MANAGEMENT_CLIENT_SECRET;
const domain = process.env.REACT_APP_AUTH0_DOMAIN;

let management;

async function getManagementApiToken() {
    const response = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            audience: `https://${domain}/api/v2/`,
            grant_type: 'client_credentials',
        }),
    });

    const data = await response.json();
    return data.access_token;
}

async function initializeManagementClient() {
    const token = await getManagementApiToken();
    management = new ManagementClient({
        token: token,
        domain: domain,
    });
}

// Initialize ManagementClient when the server starts
initializeManagementClient().catch(err => {
    console.error('Error initializing ManagementClient:', err);
});


app.post('/get-user-metadata', async (req, res) => {
    console.log('getting user metadata');
    const { userId } = req.body;

    try {
        // Get the user details
        const user = await management.getUser({ id: userId });

        if (!user.user_metadata) {
            user.user_metadata = {};
            user.user_metadata.groups = []; // list of names of groups the user is in 
        }

        console.log(user.user_metadata.groups);
        res.status(200).json({ user_metadata: user.user_metadata.groups });
    } catch (error) {
        console.error('Error fetching user metadata:', error);
        res.status(500).json({ message: 'Failed to fetch user metadata' });
    }
});


app.post('/add-group', async (req, res) => {
    console.log('adding new group');
    const { userId, userGroups, newGroup } = req.body;


    try {
        // Initialize a new ManagementClient for this request
        const management = new ManagementClient({
            token: await getManagementApiToken(),
            domain: domain,
        });

        // Update user metadata with the new groups
        await management.updateUser(
            { id: userId },
            { user_metadata: { groups: userGroups.concat([newGroup]) } } // Ensure you update with the correct field name
        );

        // Get the last group from the list
        const collectionName = newGroup[0]; // Use the last group's name as the collection name

        // Connect to MongoDB
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);

        // Create a collection for the last group
        await db.createCollection(collectionName); // Create the collection if it doesn't already exist

        // Close the MongoDB connection
        client.close();

        res.status(200).json({ message: 'User metadata updated and collection created successfully' });

    } catch (error) {
        console.error('Error updating user metadata and creating collection:', error);
        res.status(500).json({ message: 'Failed to update user metadata and create collection' });
    }
});



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

// Route to add a new note to a group's collection
app.post('/lectures/:groupName', async (req, res) => {
    const { groupName } = req.params;
    const { title, notes, bullets } = req.body;

    let client;

    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection(groupName); // Access collection with name = groupName

        const newNote = { title, notes, bullets, createdAt: new Date() }; 
        const result = await collection.insertOne(newNote);

        res.status(201).json({ message: 'Note added successfully', noteId: result.insertedId });
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
