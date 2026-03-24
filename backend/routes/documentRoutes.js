const express = require('express');
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  explainSimply,
  generateQuestions,
  generateHighlights
} = require('../controllers/documentController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect); // All routes below are protected

router.route('/')
  .post(upload.single('file'), uploadDocument)
  .get(getDocuments);

router.route('/:id')
  .delete(deleteDocument);

router.route('/:id/explain').get(explainSimply);
router.route('/:id/questions').get(generateQuestions);
router.route('/:id/highlights').get(generateHighlights);

module.exports = router;
