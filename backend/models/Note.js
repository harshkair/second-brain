const mongoose = require('mongoose');

// Existing Note Schema
const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'blue',
  },
  tag: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  position: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

const edgeSchema = new mongoose.Schema({
  edgeId: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  style: {
    stroke: {
      type: String,
      default: 'hsl(var(--tree-connection))'
    },
    strokeWidth: {
      type: Number,
      default: 2
    }
  },
  type: {
    type: String,
    default: 'default'
  },
  animated: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

edgeSchema.index({ source: 1, target: 1 }, { unique: true });
edgeSchema.index({ source: 1 });
edgeSchema.index({ target: 1 });

// Export both models
const Note = mongoose.model('Note', noteSchema);
const Edge = mongoose.model('Edge', edgeSchema);

module.exports = { Note, Edge };