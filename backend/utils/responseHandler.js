/**
 * Format a consistent API success response
 * @param {Response} res 
 * @param {number} statusCode 
 * @param {string} message 
 * @param {Object} data 
 */
const sendResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

module.exports = { sendResponse };
