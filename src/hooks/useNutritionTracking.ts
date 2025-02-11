import { useState, useEffect } from 'react';
import { NutritionData, DailySummary } from '../types';
import * as HealthKitService from '../services/HealthKitService';
import * as ClaudeService from '../services/ClaudeService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useNutritionTracking = () => {
  const [isHealthKitAuthorized, setIsHealthKitAuthorized] = useState(false);
  const [todaysNutrition, setTodaysNutrition] = useState<NutritionData | null>(null);
  const [nutritionGoals, setNutritionGoals] = useState<DailySummary['goals']>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeTracking();
  }, []);

  const initializeTracking = async () => {
    try {
      await HealthKitService.initializeHealthKit();
      setIsHealthKitAuthorized(true);
      
      // Load saved goals
      const savedGoals = await AsyncStorage.getItem('nutritionGoals');
      if (savedGoals) {
        setNutritionGoals(JSON.parse(savedGoals));
      }
      
      await fetchTodaysNutrition();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize tracking');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysNutrition = async () => {
    try {
      const nutrition = await HealthKitService.getTodaysNutrition();
      setTodaysNutrition(nutrition);
      return nutrition;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data');
      return null;
    }
  };

  const saveGoals = async (goals: DailySummary['goals']) => {
    try {
      await AsyncStorage.setItem('nutritionGoals', JSON.stringify(goals));
      setNutritionGoals(goals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save goals');
    }
  };

  const generateDailySummary = async (): Promise<string | null> => {
    try {
      if (!todaysNutrition) {
        await fetchTodaysNutrition();
      }
      
      if (!todaysNutrition) {
        throw new Error('No nutrition data available');
      }

      const summary: DailySummary = {
        nutritionData: todaysNutrition,
        goals: nutritionGoals,
      };

      return await ClaudeService.generateDailySummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
      return null;
    }
  };

  return {
    isHealthKitAuthorized,
    todaysNutrition,
    nutritionGoals,
    loading,
    error,
    fetchTodaysNutrition,
    saveGoals,
    generateDailySummary,
  };
}; 