import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Replace with your actual Gemini API key, or use environment variables
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

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
    
    // Normalize response
    if (text.toLowerCase().includes("dyslexia")) return "Dyslexia";
    if (text.toLowerCase().includes("autism")) return "Autism";
    return "ADHD";
  } catch (error) {
    console.error("AI Assessment Error:", error);
    return "ADHD"; // Default fallback
  }
};

export const generateInsights = async (progressData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Based on this student's progress data: ${JSON.stringify(progressData)}, write a short, 2-sentence insight for the teacher explaining what the student is struggling with and a brief recommendation.`;
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch(e) {
        return "Student is progressing, but requires more focus on recent topics.";
    }
}
