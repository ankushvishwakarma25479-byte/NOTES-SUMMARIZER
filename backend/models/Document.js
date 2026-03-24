const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['PDF', 'TXT'],
    required: true
  },
  fileUrl: {
    type: String, // Or mock path
    required: true
  },
  extractedText: {
    type: String,
    default: '' // Mock for now
  },
  summary: {
    type: String,
    default: '' // Mock for now
  },
  keyPoints: {
    type: [String],
    default: [] // Mock for now
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', documentSchema);
