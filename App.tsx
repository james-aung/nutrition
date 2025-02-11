/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Button, Alert, View } from 'react-native';
import { NutritionSummary } from './src/components/NutritionSummary';
import { useNutritionTracking } from './src/hooks/useNutritionTracking';
import { generateSampleData } from './src/services/HealthKitService';

function App(): React.JSX.Element {
  const {
    todaysNutrition,
    loading,
    error,
    generateDailySummary,
    fetchTodaysNutrition,
  } = useNutritionTracking();

  const [lastSummaryTime, setLastSummaryTime] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    const summary = await generateDailySummary();
    if (summary) {
      Alert.alert('Daily Summary', summary);
      setLastSummaryTime(new Date().toISOString());
    }
  };

  const handleGenerateSampleData = async () => {
    const success = await generateSampleData();
    if (success) {
      Alert.alert('Success', 'Sample data generated successfully');
      fetchTodaysNutrition(); // Refresh the data display
    } else {
      Alert.alert('Error', 'Failed to generate sample data');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NutritionSummary
        nutritionData={todaysNutrition}
        loading={loading}
        error={error}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Generate Daily Summary"
          onPress={handleGenerateSummary}
        />
        {__DEV__ && ( // Only show in development mode
          <Button
            title="Generate Sample Data"
            onPress={handleGenerateSampleData}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    padding: 16,
    gap: 8,
  },
});

export default App;
