import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import Typesense from 'typesense';
import notesRouter from './routes/notes.js';
import typesense from './typesenseClient.js';
import notesSchema from './typesense/notesSchema.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/second-brain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Typesense client
const typesense = new Typesense.Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz', // Replace with your Typesense API key
  connectionTimeoutSeconds: 2,
});

// Ensure Typesense collection exists
async function ensureTypesenseCollection() {
  try {
    await typesense.collections('notes').retrieve();
  } catch (err) {
    if (err && err.httpStatus === 404) {
      await typesense.collections().create(notesSchema);
      console.log('Typesense notes collection created');
    } else {
      console.error('Typesense error:', err);
    }
  }
}

ensureTypesenseCollection();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Notes API
app.use('/notes', notesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});