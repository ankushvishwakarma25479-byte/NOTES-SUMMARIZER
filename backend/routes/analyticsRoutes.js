const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.route('/')
  .get(getAnalytics);

module.exports = router;
