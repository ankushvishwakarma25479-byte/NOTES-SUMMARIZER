const Document = require('../models/Document');
const User = require('../models/User');
const { sendResponse } = require('../utils/responseHandler');

// @desc    Get global analytics
// @route   GET /api/v1/analytics
// @access  Public or Private (depending on requirements, keeping Public for easy access)
const getAnalytics = async (req, res, next) => {
  try {
    // 1. Total documents uploaded
    const totalDocuments = await Document.countDocuments();

    // 2. Average summary length
    // We can simulate this by fetching all documents and averaging the length of the summary string
    const documents = await Document.find({}).select('summary userId');
    
    let totalLength = 0;
    documents.forEach(doc => {
      if (doc.summary) {
        totalLength += doc.summary.length;
      }
    });
    
    const averageSummaryLength = totalDocuments > 0 ? Math.round(totalLength / totalDocuments) : 0;

    // 3. Most active user stats
    // Aggregate to find which user has the most documents
    const activeUsers = await Document.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let mostActiveUser = null;
    if (activeUsers.length > 0) {
      const user = await User.findById(activeUsers[0]._id).select('name email');
      if (user) {
        mostActiveUser = {
          userId: user._id,
          name: user.name,
          email: user.email,
          documentsUploaded: activeUsers[0].count
        };
      }
    }

    sendResponse(res, 200, 'Analytics retrieved successfully', {
      totalDocuments,
      averageSummaryLengthTokensOrChars: averageSummaryLength,
      mostActiveUser
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAnalytics
};
