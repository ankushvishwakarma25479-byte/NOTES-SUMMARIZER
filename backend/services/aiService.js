const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

exports.summarizeText = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: "You are an expert at summarizing long documents." },
        { role: "user", content: `Please summarize the following document concisely. Return only the summary text.\n\nDocument text:\n${text}` }
      ],
      temperature: 0.5,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error (summarizeText):", error);
    throw new Error("Failed to summarize text");
  }
};

exports.generateKeyHighlights = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: "You extract key highlights from documents. Return a JSON array of strings, where each string is a highlight. Example: [\"Point 1\", \"Point 2\"]" },
        { role: "user", content: `Extract the 3 to 5 most important highlights from this document:\n\n${text}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });
    // Fallback parsing just in case
    const content = response.choices[0].message.content;
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.highlights && Array.isArray(parsed.highlights)) return parsed.highlights;
      return [content];
    } catch {
      return Object.values(JSON.parse(content) || {})[0] || [];
    }
  } catch (error) {
    console.error("OpenAI Error (generateKeyHighlights):", error);
    throw new Error("Failed to generate highlights");
  }
};

exports.generateQuestions = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: "You act as a teacher. Generate 3 to 5 thought-provoking questions based on the provided document. Return a JSON object with a 'questions' key containing an array of strings." },
        { role: "user", content: `Generate questions to test understanding of this text:\n\n${text}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.questions || [];
  } catch (error) {
    console.error("OpenAI Error (generateQuestions):", error);
    throw new Error("Failed to generate questions");
  }
};

exports.explainSimply = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert at explaining complex concepts in simple terms. Explain the text like the reader is 5 years old (ELI5). Ensure the output is an easy-to-read, short paragraph." },
        { role: "user", content: `Explain this text simply:\n\n${text}` }
      ],
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error (explainSimply):", error);
    throw new Error("Failed to explain simply");
  }
};

exports.generateAnswer = async (context, question) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant answering a question based ONLY on the provided document context. If the answer is not in the context, say 'The answer is not available in the given document.'" },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
      ],
      temperature: 0.3,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error (generateAnswer):", error);
    throw new Error("Failed to generate answer");
  }
};
