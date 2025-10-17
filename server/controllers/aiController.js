// server/controllers/aiController.js - FINAL ROBUST VERSION
import OpenAI from 'openai';

export const generateIdea = async (req, res) => {
  // Initialize the OpenAI client with custom settings for OpenRouter
  const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5173", // Good for local testing
      "X-Title": "Treasure of Ideas",
    },
  });

  const { keywords } = req.body;
  if (!keywords || keywords.length === 0) {
    return res.status(400).json({ message: 'Please provide some keywords.' });
  }

  // The prompt is well-defined for generating JSON
  const prompt = `You are an expert project idea generator. Your task is to generate a single, creative project idea based on these keywords: ${keywords.join(', ')}. Your response MUST be a single, valid JSON object. Do not include any other text, explanation, or markdown formatting like \`\`\`json. The JSON object must have the following exact keys: "title", "description", "tags" (an array of 3-4 relevant string tags), "difficulty" ("Beginner", "Intermediate", or "Advanced"), and "category" ("Software", "Hardware", or "Both").`;

  try {
    const response = await openrouter.chat.completions.create({
      // Using a reliable, free model on OpenRouter
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });
    
    const responseText = response.choices[0].message.content;
    
    // --- THIS IS THE CRITICAL FIX ---
    // Find the first '{' and the last '}' to extract only the valid JSON part.
    // This makes the code resilient to extra tokens or text from the AI.
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("AI response did not contain valid JSON.");
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);

    // Now, parse the cleaned string
    const ideaJSON = JSON.parse(jsonString);
    res.status(200).json(ideaJSON);

  } catch (error) {
    console.error("OpenRouter API call failed:", error);
    res.status(500).json({ message: "Failed to generate AI idea. The AI service may be temporarily unavailable or the response was malformed." });
  }
};