import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBLS15IzfiNW5m_Ua4JadV_8C9mLaOxuHI");

export const generateAssessment = async (userInput) => {
  try {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an AI analyzing a child's learning style based on their response. 
    Categorize their likely learning profile into exactly one of these three: Dyslexia, ADHD, Autism.
    If uncertain, default to ADHD.
    Child's response: "${userInput}"
    Return ONLY the category name.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    if (text.toLowerCase().includes("dyslexia")) return "Dyslexia";
    if (text.toLowerCase().includes("autism")) return "Autism";
    return "ADHD";
  } catch (error) {
    console.error("AI Assessment Error:", error);
    return "ADHD";
  }
};

export const startAdaptiveChat = async (age, gender) => {
  const adaptiveSystemPrompt = `You are a friendly, child-appropriate AI conducting an adaptive assessment to detect learning disabilities (Dyslexia, ADHD, or Autism).
The child is a ${age}-year-old ${gender}.
Rules:
1. Ask exactly ONE simple question at a time. Do not overwhelm the child. Make sure the vocabulary and tone are appropriate for a ${age}-year-old.
2. Provide 2-3 multiple-choice options or suggest a short answer.
3. Adapt your next question based on the previous answer to drill down. 
    - E.g., if they say reading is hard, ask if letters jump around (Dyslexia). If they say sitting still is hard, ask about boredom or fidgeting (ADHD). If they mention loud noises or changes in routine, ask about sensory issues (Autism).
4. Once you have enough information to confidently determine the condition, output EXACTLY this phrase on a new line: "DIAGNOSIS: [Condition]" (e.g., DIAGNOSIS: Dyslexia). Do NOT output this until you are sure (usually after 3-4 questions).`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: adaptiveSystemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: `Understood. I will adapt my language for a ${age}-year-old and output DIAGNOSIS: [Condition] when I am certain.` }],
      },
    ],
  });
  
  // Get the first question
  const result = await chat.sendMessage("Hello! Please ask me the first question to start the assessment.");
  return {
    chatSession: chat,
    firstMessage: result.response.text()
  };
};

