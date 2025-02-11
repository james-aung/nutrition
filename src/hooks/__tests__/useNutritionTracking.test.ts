import { renderHook, act } from '@testing-library/react-native';
import { useNutritionTracking } from '../useNutritionTracking';
import * as HealthKitService from '../../services/HealthKitService';
import * as ClaudeService from '../../services/ClaudeService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the external services
jest.mock('../../services/HealthKitService');
jest.mock('../../services/ClaudeService');
jest.mock('@react-native-async-storage/async-storage');

describe('useNutritionTracking', () => {
  const mockNutritionData = {
    calories: 2000,
    protein: 80,
    carbohydrates: 250,
    fat: 65,
    date: '2024-02-11T12:00:00.000Z',
  };

  const mockGoals = {
    calories: 2200,
    protein: 100,
    carbohydrates: 275,
    fat: 70,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (HealthKitService.initializeHealthKit as jest.Mock).mockResolvedValue(undefined);
    (HealthKitService.getTodaysNutrition as jest.Mock).mockResolvedValue(mockNutritionData);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (ClaudeService.generateDailySummary as jest.Mock).mockResolvedValue('Mock summary');
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useNutritionTracking());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.todaysNutrition).toBe(null);
    expect(result.current.nutritionGoals).toBeUndefined();
  });

  it('loads nutrition data on mount', async () => {
    const { result } = renderHook(() => useNutritionTracking());

    // Wait for all state updates to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.todaysNutrition).toEqual(mockNutritionData);
    expect(HealthKitService.initializeHealthKit).toHaveBeenCalled();
    expect(HealthKitService.getTodaysNutrition).toHaveBeenCalled();
  });

  it('loads saved goals from storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockGoals));

    const { result } = renderHook(() => useNutritionTracking());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.nutritionGoals).toEqual(mockGoals);
  });

  it('handles errors during initialization', async () => {
    const error = new Error('Failed to initialize HealthKit');
    (HealthKitService.initializeHealthKit as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useNutritionTracking());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error.message);
  });

  it('generates daily summary successfully', async () => {
    const { result } = renderHook(() => useNutritionTracking());

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    let summary;
    await act(async () => {
      summary = await result.current.generateDailySummary();
    });

    expect(summary).toBe('Mock summary');
    expect(ClaudeService.generateDailySummary).toHaveBeenCalledWith({
      nutritionData: mockNutritionData,
      goals: undefined,
    });
  });
}); 