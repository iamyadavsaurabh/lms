import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'

// intilise express
const app = express()

// connect to DB
await connectDB()

// middleware connect our backend to the frontend
app.use(cors())

// is used to define a route handler for the root URL (/) of your Express server.
// When someone visits http://localhost:PORT/ in their browser or makes a GET request to /, the server responds with "API Working".
app.get('/', (req, res) => {
  res.send("API Working")
})

// for this app to work we need to define a port
const PORT = process.env.PORT || 5000

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
