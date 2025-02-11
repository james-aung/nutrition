export interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  date: string;
}

export interface DailySummary {
  nutritionData: NutritionData;
  goals?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
} 