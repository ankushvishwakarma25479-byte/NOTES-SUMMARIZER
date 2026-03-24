const Document = require('../models/Document');
const { sendResponse } = require('../utils/responseHandler');
const fs = require('fs');
const aiService = require('../services/aiService');
const pdfParser = require('../utils/pdfParser');

// @desc    Upload document
// @route   POST /api/v1/documents
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file', data: {} });
    }

    let extractedText = '';
    let summary = '';
    let keyPoints = [];

    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      extractedText = await pdfParser.extractText(fileBuffer, req.file.mimetype);
      summary = await aiService.summarizeText(extractedText);
      keyPoints = await aiService.generateKeyHighlights(extractedText);
    } catch (aiError) {
      console.error('AI Processing Error:', aiError);
      return res.status(500).json({ success: false, message: 'Failed to process document with AI', data: {} });
    }

    const document = await Document.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype === 'text/plain' ? 'TXT' : 'PDF',
      fileUrl: req.file.path,
      extractedText,
      summary,
      keyPoints
    });

    sendResponse(res, 201, 'Document uploaded successfully', document);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user documents
// @route   GET /api/v1/documents
// @access  Private
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user._id }).sort('-uploadedAt');
    sendResponse(res, 200, 'Documents retrieved', documents);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete document
// @route   DELETE /api/v1/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found', data: {} });
    }

    // Make sure user owns document
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this document', data: {} });
    }

    await document.deleteOne();

    sendResponse(res, 200, 'Document deleted', {});
  } catch (err) {
    next(err);
  }
};

// @desc    Explain document simply
// @route   GET /api/v1/documents/:id/explain
// @access  Private
const explainSimply = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    if (document.userId.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });

    const explanation = await aiService.explainSimply(document.extractedText);
    sendResponse(res, 200, 'Explanation generated', { explanation });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate questions for a document
// @route   GET /api/v1/documents/:id/questions
// @access  Private
const generateQuestions = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    if (document.userId.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });

    const questions = await aiService.generateQuestions(document.extractedText);
    sendResponse(res, 200, 'Questions generated', { questions });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate extra highlights
// @route   GET /api/v1/documents/:id/highlights
// @access  Private
const generateHighlights = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    if (document.userId.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });

    const highlights = await aiService.generateKeyHighlights(document.extractedText);
    sendResponse(res, 200, 'Highlights generated', { highlights });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  explainSimply,
  generateQuestions,
  generateHighlights
};
