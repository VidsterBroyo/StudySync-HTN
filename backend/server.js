const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())


const PORT = process.env.PORT || 3001


const uri = "mongodb+srv://vidsterbroyo:Du2y8XDVkfTNmo8d@studybuddymongo.ny5sq.mongodb.net/?retryWrites=true&w=majority&appName=StudyBuddyMongo";
mongoose.connect(uri)
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err))


app.set('view engine', 'ejs');

app.listen(3000);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


