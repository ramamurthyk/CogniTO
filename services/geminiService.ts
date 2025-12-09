
import { GoogleGenAI } from '@google/genai';
import { AssessmentScores } from '../types';

/**
 * Generates a personalized cognitive profile message using the Gemini API.
 * @param scores The assessment scores to base the message on.
 * @returns A promise that resolves to the generated message string.
 */
export const generateCognitiveProfileMessage = async (scores: AssessmentScores): Promise<string> => {
  // CRITICAL: Initialize GoogleGenAI right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-2.5-flash'; // Optimized for general text tasks

  // Determine strongest and weakest areas
  const areas = [
    { name: 'Memory (Numbers)', score: scores.memoryNumbers },
    { name: 'Memory (Words)', score: scores.memoryWords },
    { name: 'Speed', score: scores.speed },
    { name: 'Logic', score: scores.logic },
    { name: 'Working Memory', score: scores.workingMemory },
  ];

  areas.sort((a, b) => b.score - a.score); // Sort descending

  const strongest = areas[0];
  const weakest = areas[areas.length - 1];

  const prompt = `
    As a cognitive health expert, analyze the following brain assessment results for an adult aged 40-75.
    Provide a professional, warm, and encouraging personalized message (2-3 sentences max) that highlights their strongest and weakest cognitive areas, and gently suggests what this means for their brain health journey.
    Avoid jargon and use a science-backed, supportive tone, celebrating progress without judgment.
    The scores are percentages (0-100) or reaction time in ms (for speed, lower is better, converted to 0-100 score where higher is better).

    Assessment Scores:
    - Memory (Numbers): ${scores.memoryNumbers}%
    - Memory (Words): ${scores.memoryWords}%
    - Speed: ${scores.speed}%
    - Logic: ${scores.logic}%
    - Working Memory: ${scores.workingMemory}%

    Based on these, your strongest area appears to be ${strongest.name} and your area for growth is ${weakest.name}.
    
    Please provide the personalized message now:
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7, // A bit creative but still factual
        maxOutputTokens: 150, // Limit message length
      },
    });

    const message = response.text?.trim();
    if (!message) {
      console.warn('Gemini API returned an empty message.');
      return `Based on your assessment, you show great potential! Focus on engaging in diverse activities to further enhance your cognitive abilities across all areas.`;
    }
    return message;
  } catch (error) {
    console.error('Error calling Gemini API for profile message:', error);
    // Graceful fallback message
    return `Based on your assessment, you're on a great path to cognitive fitness! Continue to challenge yourself with varied exercises to maintain and improve your brain health.`;
  }
};
