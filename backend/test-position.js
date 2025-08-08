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
  console.log('✅ Connected to MongoDB');
  
  try {
    // Clear existing test notes
    await Note.deleteMany({ name: { $regex: /^Test Note/ } });
    console.log('🧹 Cleared existing test notes');
    
    // Create a test note with specific position
    const testNote = new Note({
      name: 'Test Note Position',
      content: 'This note should appear at position x: 500, y: 300',
      color: '#ff6b6b',
      tag: 'test',
      position: { x: 500, y: 300 }
    });
    
    const savedNote = await testNote.save();
    console.log('✅ Test note created with position:', savedNote.position);
    
    // Retrieve the note and check position
    const retrievedNote = await Note.findById(savedNote._id);
    console.log('📖 Retrieved note position:', retrievedNote.position);
    
    // Test updating position
    const updatedNote = await Note.findByIdAndUpdate(
      savedNote._id,
      { position: { x: 600, y: 400 } },
      { new: true }
    );
    console.log('🔄 Updated note position:', updatedNote.position);
    
    // Test retrieving all notes
    const allNotes = await Note.find();
    console.log('📋 All notes in database:', allNotes.length);
    allNotes.forEach((note, index) => {
      console.log(`  ${index + 1}. ${note.name} - Position: ${JSON.stringify(note.position)}`);
    });
    
    console.log('🎉 Position test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during position testing:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
});
