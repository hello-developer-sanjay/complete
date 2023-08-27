const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

// Connect to MongoDB (mydb)
const mongoURIMyDB = process.env.MONGODB_URI_MYDB;

mongoose.connect(mongoURIMyDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB (mydb)');
})
.catch(error => {
  console.error('Error connecting to MongoDB (mydb):', error);
});

// Models for 'ageofai', 'devtools', 'webdev', 'road', 'tools', 'working', and 'feedback' collections
const AgeOfAI = mongoose.model('ageofai', {
  title: String,
  overview: [String],
  keypoints: [String],
});

const DevTools = mongoose.model('devtools', {
  title: String,
  overview: [String],
  CourseDetails: [String],
  keypoints: [String],
  imageURL: [String],
  videoURL: [String],
});

const WebDev = mongoose.model('webdev', {
  title: String,
  overview: [String],
  description: [String],
  keypoints: [String],
});

const Road = mongoose.model('road', {
  title: String,
  overview: [String],
  description: [String],
  keypoints: [String],
});

const Tools = mongoose.model('tools', {
  title: String,
  overview: [String],
  description: [String],
  keypoints: [String],
  imageURL: [String],
  videoURL: [String],
});

const Working = mongoose.model('working', {
  title: String,
  overview: [String],
  description: [String],
  keypoints: [String],
  imageURL: [String],
  videoURL: [String],
});

const Feedback = mongoose.model('feedback', {
  name: String,
  email: String,
  feedback: String,
});
const Query = mongoose.model('query', {
  name: String,
  email: String,
  query: String,
});


// Routes for all collections
app.get('/api/:collection', async (req, res) => {
  const collection = req.params.collection;
  try {
    let data;
    switch (collection) {
      case 'ageofai':
        data = await AgeOfAI.find().lean();
        break;
      case 'devtools':
        data = await DevTools.find().lean();
        break;
      case 'webdev':
        data = await WebDev.find().lean();
        break;
      case 'road':
        data = await Road.find().lean();
        break;
      case 'tools':
        data = await Tools.find().lean();
        break;
      case 'working':
        data = await Working.find().lean();
        break;
      default:
        return res.status(404).json({ error: 'Collection not found' });
    }
    console.log('Data fetched successfully from', collection, 'collection:', data);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching data from ${collection} collection:`, error);
    res.status(500).json({ error: `Error fetching data from ${collection} collection` });
  }
});

// Route for submitting feedback
app.post('/api/submit-feedback', async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      feedback,
    });
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Error submitting feedback' });
  }
});

app.post('/api/submit-query', async (req, res) => {
  try {
    const { name, email, query } = req.body;

    const newQuery = new Query({
      name,
      email,
      query,
    });
    await newQuery.save();

    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ error: 'Error submitting query' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to My API');
});

// Not Found route
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(port, () => {
 console.log(`Backend server is running on port ${port}`);
});
// Listen for MongoDB collection events
mongoose.connection.on('collection', (collectionName) => {
  console.log(`Collection ${collectionName} changed.`);
});
