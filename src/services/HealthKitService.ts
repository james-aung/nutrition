import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';
import { NutritionData } from '../types';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Dietary,
      AppleHealthKit.Constants.Permissions.DietaryEnergy,
      AppleHealthKit.Constants.Permissions.DietaryProtein,
      AppleHealthKit.Constants.Permissions.DietaryFatTotal,
      AppleHealthKit.Constants.Permissions.DietaryCarbohydrates,
    ],
    write: [],
  },
} as HealthKitPermissions;

export const initializeHealthKit = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};

export const getTodaysNutrition = async (): Promise<NutritionData> => {
  const options: HealthInputOptions = {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  };

  const [calories, protein, carbs, fat] = await Promise.all([
    getDietaryEnergy(options),
    getDietaryProtein(options),
    getDietaryCarbs(options),
    getDietaryFat(options),
  ]);

  return {
    calories,
    protein,
    carbohydrates: carbs,
    fat,
    date: new Date().toISOString(),
  };
};

const getDietaryEnergy = (options: HealthInputOptions): Promise<number> => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getDietaryEnergy(options, (err: string, results: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results?.value || 0);
    });
  });
};

const getDietaryProtein = (options: HealthInputOptions): Promise<number> => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getDietaryProtein(options, (err: string, results: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results?.value || 0);
    });
  });
};

const getDietaryCarbs = (options: HealthInputOptions): Promise<number> => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getDietaryCarbohydrates(options, (err: string, results: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results?.value || 0);
    });
  });
};

const getDietaryFat = (options: HealthInputOptions): Promise<number> => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getDietaryFatTotal(options, (err: string, results: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results?.value || 0);
    });
  });
}; 