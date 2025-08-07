import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, required: true },
  tag: { type: String },
  imageUrl: { type: String },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model('Note', NoteSchema);