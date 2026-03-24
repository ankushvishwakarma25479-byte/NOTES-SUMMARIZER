const express = require('express');
const { askQuestion, getChatHistory } = require('../controllers/qaController');
const { protect } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.use(protect);

const validateQA = [
  check('question', 'Question is required').not().isEmpty()
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', data: errors.array() });
  }
  next();
};

router.route('/:documentId')
  .post(validateQA, checkValidation, askQuestion)
  .get(getChatHistory);

module.exports = router;
