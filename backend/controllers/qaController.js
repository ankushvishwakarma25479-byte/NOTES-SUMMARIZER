const QA = require('../models/QA');
const Document = require('../models/Document');
const { sendResponse } = require('../utils/responseHandler');

// @desc    Ask a question based on a document
// @route   POST /api/v1/qa/:documentId
// @access  Private
const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    const documentId = req.params.documentId;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Please provide a question', data: {} });
    }

const aiService = require('../services/aiService');

    // Ensure document exists and belongs to user
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found', data: {} });
    }
    
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this document', data: {} });
    }

    // Generate real AI Response
    const answer = await aiService.generateAnswer(document.extractedText, question);

    const qa = await QA.create({
      documentId,
      userId: req.user._id,
      question,
      answer
    });

    sendResponse(res, 201, 'Question answered successfully', qa);
  } catch (err) {
    next(err);
  }
};

// @desc    Get chat history for a document
// @route   GET /api/v1/qa/:documentId
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const documentId = req.params.documentId;

    // Optional: check if document belongs to user
    const document = await Document.findById(documentId);
    if (!document || document.userId.toString() !== req.user._id.toString()) {
       return res.status(404).json({ success: false, message: 'Document not found or access denied', data: {} });
    }

    const history = await QA.find({ documentId }).sort('createdAt');
    sendResponse(res, 200, 'Chat history retrieved', history);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  askQuestion,
  getChatHistory
};
