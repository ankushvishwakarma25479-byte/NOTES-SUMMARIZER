const pdf = require('pdf-parse');

exports.extractText = async (fileBuffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    try {
      const data = await pdf(fileBuffer);
      return data.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF');
    }
  } else if (mimetype === 'text/plain') {
    return fileBuffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file type');
  }
};
