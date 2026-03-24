const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Document',
    required: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QA', qaSchema);
