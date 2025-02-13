import Anthropic from '@anthropic-ai/sdk';
import { DailySummary } from '../types';
import Config from 'react-native-config';

if (!Config.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
}

const anthropic = new Anthropic({
  apiKey: Config.ANTHROPIC_API_KEY,
});

export const generateDailySummary = async (data: DailySummary): Promise<string> => {
  try {
    if (!data.nutritionData) {
      throw new Error('No nutrition data provided');
    }

    const goalsSection = data.goals 
      ? `Daily Goals:
        Calories: ${data.goals.calories || 'Not set'}
        Protein: ${data.goals.protein || 'Not set'}g
        Carbohydrates: ${data.goals.carbohydrates || 'Not set'}g
        Fat: ${data.goals.fat || 'Not set'}g`
      : 'No goals set yet';

    const prompt = `Please analyze this daily nutrition data and provide a friendly, concise summary with personalized recommendations. Here's the data:
        
    Current Intake:
    Calories: ${data.nutritionData.calories}
    Protein: ${data.nutritionData.protein}g
    Carbohydrates: ${data.nutritionData.carbohydrates}g
    Fat: ${data.nutritionData.fat}g
    
    ${goalsSection}
    
    Please provide a concise summary that includes:
    1. A brief overview of their daily intake
    2. How well they met their goals (if set)
    3. One or two specific, actionable recommendations for improvement
    4. A brief positive encouragement
    
    Keep the tone friendly and motivational. Focus on progress and improvement rather than shortcomings.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.7,
    });

    const response = message.content[0];
    if (!response || typeof response.text !== 'string') {
      throw new Error('No response received from Claude');
    }

    return response.text;
  } catch (error) {
    console.error('Error generating daily summary:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate daily summary');
  }
}; 