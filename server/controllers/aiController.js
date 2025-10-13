import OpenAI from 'openai';

// DO NOT initialize the client here. We will do it inside the function.
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateIdea = async (req, res) => {
  // --- THIS IS THE FIX ---
  // Initialize the OpenAI client here, inside the async function.
  // By the time this function is called, dotenv.config() will have already run.
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { keywords } = req.body;
  if (!keywords || keywords.length === 0) {
    return res.status(400).json({ message: 'Please provide some keywords.' });
  }

  const prompt = `
    You are an expert project idea generator.
    Generate a single, creative, and specific project idea based on these keywords: ${keywords.join(', ')}.
    Your response MUST be a single, valid JSON object. Do not include any other text, explanation, or markdown formatting like \`\`\`json.
    The JSON object must have the following exact keys:
    - "title": A catchy and descriptive string title.
    - "description": A string of 2-3 sentences explaining the project.
    - "tags": An array of 3-4 relevant string tags.
    - "difficulty": A string, which must be one of: "Beginner", "Intermediate", or "Advanced".
    - "category": A string, which must be one of: "Software", "Hardware", or "Both".
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });
    
    const ideaJSON = JSON.parse(response.choices[0].message.content);
    res.status(200).json(ideaJSON);

  } catch (error) {
    // Add a specific check for authentication errors
    if (error instanceof OpenAI.APIError && error.status === 401) {
        console.error("OpenAI Authentication Error: Check your API Key in the .env file.");
        return res.status(500).json({ message: "AI service authentication failed. Check server configuration." });
    }
    console.error("AI generation failed:", error);
    res.status(500).json({ message: "Failed to generate AI idea." });
  }
};