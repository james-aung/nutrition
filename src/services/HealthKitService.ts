import HealthKit, {
  HKQuantityTypeIdentifier,
  HKUnit,
} from '@kingstinct/react-native-healthkit';
import { NutritionData } from '../types';

export const initializeHealthKit = async (): Promise<void> => {
  // First check if HealthKit is available
  const isAvailable = await HealthKit.isHealthDataAvailable();
  if (!isAvailable) {
    throw new Error('HealthKit is not available on this device');
  }

  // Request both read and write permissions
  await HealthKit.requestAuthorization(
    [
      HKQuantityTypeIdentifier.dietaryEnergyConsumed,
      HKQuantityTypeIdentifier.dietaryProtein,
      HKQuantityTypeIdentifier.dietaryFatTotal,
      HKQuantityTypeIdentifier.dietaryCarbohydrates,
    ],
    [
      HKQuantityTypeIdentifier.dietaryEnergyConsumed,
      HKQuantityTypeIdentifier.dietaryProtein,
      HKQuantityTypeIdentifier.dietaryFatTotal,
      HKQuantityTypeIdentifier.dietaryCarbohydrates,
    ]
  );
};

export const getTodaysNutrition = async (): Promise<NutritionData> => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const [calories, protein, carbs, fat] = await Promise.all([
    HealthKit.queryQuantitySamples(
      HKQuantityTypeIdentifier.dietaryEnergyConsumed,
      {
        startDate: startOfDay,
        endDate: endOfDay,
      }
    ).then(samples => samples.reduce((total, sample) => total + sample.quantity, 0)),
    HealthKit.queryQuantitySamples(
      HKQuantityTypeIdentifier.dietaryProtein,
      {
        startDate: startOfDay,
        endDate: endOfDay,
      }
    ).then(samples => samples.reduce((total, sample) => total + sample.quantity, 0)),
    HealthKit.queryQuantitySamples(
      HKQuantityTypeIdentifier.dietaryCarbohydrates,
      {
        startDate: startOfDay,
        endDate: endOfDay,
      }
    ).then(samples => samples.reduce((total, sample) => total + sample.quantity, 0)),
    HealthKit.queryQuantitySamples(
      HKQuantityTypeIdentifier.dietaryFatTotal,
      {
        startDate: startOfDay,
        endDate: endOfDay,
      }
    ).then(samples => samples.reduce((total, sample) => total + sample.quantity, 0)),
  ]);

  return {
    calories: calories || 0,
    protein: protein || 0,
    carbohydrates: carbs || 0,
    fat: fat || 0,
    date: now.toISOString(),
  };
};

export const generateSampleData = async () => {
  const now = new Date();
  const sampleData = [
    {
      calories: 500,
      protein: 25,
      carbs: 60,
      fat: 15,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      calories: 700,
      protein: 35,
      carbs: 80,
      fat: 20,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
    {
      calories: 400,
      protein: 20,
      carbs: 45,
      fat: 12,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
  ];

  try {
    // Make sure HealthKit is initialized first
    await initializeHealthKit();

    for (const meal of sampleData) {
      const { calories, protein, carbs, fat, timestamp } = meal;
      
      await Promise.all([
        // Save calories
        HealthKit.saveQuantitySample(
          HKQuantityTypeIdentifier.dietaryEnergyConsumed,
          'kcal',
          calories,
          {
            start: timestamp,
            end: timestamp
          }
        ),
        // Save protein
        HealthKit.saveQuantitySample(
          HKQuantityTypeIdentifier.dietaryProtein,
          'g',
          protein,
          {
            start: timestamp,
            end: timestamp
          }
        ),
        // Save carbs
        HealthKit.saveQuantitySample(
          HKQuantityTypeIdentifier.dietaryCarbohydrates,
          'g',
          carbs,
          {
            start: timestamp,
            end: timestamp
          }
        ),
        // Save fat
        HealthKit.saveQuantitySample(
          HKQuantityTypeIdentifier.dietaryFatTotal,
          'g',
          fat,
          {
            start: timestamp,
            end: timestamp
          }
        ),
      ]);
    }
    
    console.log('Sample data generated successfully');
    return true;
  } catch (error) {
    console.error('Error generating sample data:', error);
    return false;
  }
}; 