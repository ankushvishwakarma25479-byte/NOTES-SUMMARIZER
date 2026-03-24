const express = require('express');
const { signup, login } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateSignup = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', data: errors.array() });
  }
  next();
};

router.post('/signup', validateSignup, checkValidation, signup);
router.post('/login', validateLogin, checkValidation, login);

module.exports = router;
