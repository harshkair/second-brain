import express from 'express';
import { Note, Edge } from '../models/Note.js';
import multer from 'multer';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();
const upload = multer();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image/file to Cloudinary
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'second-brain-notes' },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NOTES ROUTES

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a note
router.post('/', async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    
    // Delete the note
    const note = await Note.findByIdAndDelete(noteId);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    
    // Delete all edges connected to this note
    await Edge.deleteMany({
      $or: [
        { source: noteId },
        { target: noteId }
      ]
    });
    
    res.json({ message: 'Note and related connections deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// EDGES ROUTES

// Get all edges
router.get('/edges', async (req, res) => {
  try {
    const edges = await Edge.find()
      .populate('source', 'name')
      .populate('target', 'name');
    
    const formattedEdges = edges.map(edge => ({
      id: edge.edgeId,
      source: edge.source._id.toString(),
      target: edge.target._id.toString(),
      style: edge.style,
      type: edge.type,
      animated: edge.animated,
      label: edge.label
    }));
    
    res.json(formattedEdges);
  } catch (error) {
    console.error('Error fetching edges:', error);
    res.status(500).json({ error: 'Failed to fetch edges' });
  }
});

// Create new edge
router.post('/edges', async (req, res) => {
  try {
    const { source, target, style, type, animated, label } = req.body;
    
    if (!source || !target) {
      return res.status(400).json({ error: 'Source and target are required' });
    }
    
    // Verify that both notes exist
    const [sourceNote, targetNote] = await Promise.all([
      Note.findById(source),
      Note.findById(target)
    ]);
    
    if (!sourceNote || !targetNote) {
      return res.status(404).json({ error: 'One or both notes not found' });
    }
    
    // Generate unique edge ID
    const edgeId = `e${source}-${target}`;
    
    // Check if edge already exists
    const existingEdge = await Edge.findOne({ edgeId });
    if (existingEdge) {
      return res.status(409).json({ error: 'Connection already exists' });
    }
    
    const edge = new Edge({
      edgeId,
      source,
      target,
      style: style || {
        stroke: 'hsl(var(--tree-connection))',
        strokeWidth: 2
      },
      type: type || 'default',
      animated: animated || false,
      label: label || ''
    });
    
    await edge.save();
    
    // Return formatted edge for frontend
    res.status(201).json({
      id: edge.edgeId,
      source: edge.source.toString(),
      target: edge.target.toString(),
      style: edge.style,
      type: edge.type,
      animated: edge.animated,
      label: edge.label
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Connection already exists' });
    }
    console.error('Error creating edge:', error);
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

// Delete an edge
router.delete('/edges/:edgeId', async (req, res) => {
  try {
    const { edgeId } = req.params;
    
    const edge = await Edge.findOneAndDelete({ edgeId });
    if (!edge) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    
    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    console.error('Error deleting edge:', error);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
});

// Get edges for a specific note
router.get('/edges/note/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    
    const edges = await Edge.find({
      $or: [
        { source: noteId },
        { target: noteId }
      ]
    }).populate('source', 'name').populate('target', 'name');
    
    const formattedEdges = edges.map(edge => ({
      id: edge.edgeId,
      source: edge.source._id.toString(),
      target: edge.target._id.toString(),
      style: edge.style,
      type: edge.type,
      animated: edge.animated,
      label: edge.label
    }));
    
    res.json(formattedEdges);
  } catch (error) {
    console.error('Error fetching note edges:', error);
    res.status(500).json({ error: 'Failed to fetch note connections' });
  }
});

export default router;