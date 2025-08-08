import mongoose from 'mongoose';
import Note from './models/Note.js';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/second-brain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Test creating a note
    const testNote = new Note({
      name: 'Test Note',
      content: 'This is a test note for MongoDB integration',
      color: '#ff6b6b',
      tag: 'test',
      position: { x: 100, y: 100 }
    });
    
    const savedNote = await testNote.save();
    console.log('✅ Note created successfully:', savedNote._id);
    
    // Test retrieving all notes
    const allNotes = await Note.find();
    console.log('✅ Retrieved notes:', allNotes.length);
    
    // Test updating a note
    const updatedNote = await Note.findByIdAndUpdate(
      savedNote._id,
      { content: 'Updated test content' },
      { new: true }
    );
    console.log('✅ Note updated successfully');
    
    // Test deleting a note
    await Note.findByIdAndDelete(savedNote._id);
    console.log('✅ Note deleted successfully');
    
    console.log('🎉 All MongoDB operations working correctly!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
});
