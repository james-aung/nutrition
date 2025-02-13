export interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  date: string;
}

export interface NutritionGoals {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
}

export interface DailySummary {
  nutritionData: NutritionData;
  goals?: NutritionGoals;
} 