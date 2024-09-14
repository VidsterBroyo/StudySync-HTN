const fsP = require('fs').promises
const express = require('express')
const app = express()
app.use(express.json())
app.use("/static", express.static('./static/'))


const PORT = process.env.PORT || 3001



// open port
app.listen(PORT, (req, res) => console.log(`Port ${PORT} Opened`))