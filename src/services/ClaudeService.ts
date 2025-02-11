import Anthropic from '@anthropic-ai/sdk';
import { DailySummary } from '../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const generateDailySummary = async (data: DailySummary): Promise<string> => {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Please analyze this daily nutrition data and provide a friendly, concise summary with personalized recommendations. Here's the data:
      
      Calories: ${data.nutritionData.calories}
      Protein: ${data.nutritionData.protein}g
      Carbohydrates: ${data.nutritionData.carbohydrates}g
      Fat: ${data.nutritionData.fat}g
      
      ${data.goals ? `Goals:
      Calories: ${data.goals.calories || 'Not set'}
      Protein: ${data.goals.protein || 'Not set'}g
      Carbohydrates: ${data.goals.carbohydrates || 'Not set'}g
      Fat: ${data.goals.fat || 'Not set'}g` : 'No goals set yet'}
      
      Please include:
      1. A brief overview of how well they met their goals (if set)
      2. One or two specific recommendations for improvement
      3. A positive encouragement`
    }]
  });

  return message.content
}; 