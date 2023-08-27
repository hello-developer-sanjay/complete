const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

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
const setJavaScriptContentType = (req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
};

// Use the middleware to set the Content-Type for JavaScript files
app.use(setJavaScriptContentType);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});


const AgeOfAI = mongoose.model('ageofai', { title: String, overview: [String], keypoints: [String] });
const DevTools = mongoose.model('devtools', { title: String, overview: [String], CourseDetails: [String], keypoints: [String], imageURL: [String], videoURL: [String] });
const WebDev = mongoose.model('webdev', { title: String, overview: [String], description: [String], keypoints: [String] });
const Road = mongoose.model('road', { title: String, overview: [String], description: [String], keypoints: [String] });
const Tools = mongoose.model('tools', { title: String, overview: [String], description: [String], keypoints: [String], imageURL: [String], videoURL: [String] });
const Working = mongoose.model('working', { title: String, overview: [String], description: [String], keypoints: [String], imageURL: [String], videoURL: [String] });
const Feedback = mongoose.model('feedback', { name: String, email: String, feedback: String });
const Query = mongoose.model('query', { name: String, email: String, query: String });


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
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Error fetching data from ${collection} collection` });
  }
});

app.post('/api/submit-feedback', async (req, res) => {
  try {
    const { name, email, feedback } = req.body;
    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting feedback' });
  }
});

app.post('/api/submit-query', async (req, res) => {
  try {
    const { name, email, query } = req.body;
    const newQuery = new Query({ name, email, query });
    await newQuery.save();
    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting query' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

mongoose.connection.on('collection', (collectionName) => {
  console.log(`Collection ${collectionName} changed.`);
});
