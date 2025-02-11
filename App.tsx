/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Button, Alert } from 'react-native';
import { NutritionSummary } from './src/components/NutritionSummary';
import { useNutritionTracking } from './src/hooks/useNutritionTracking';

function App(): React.JSX.Element {
  const {
    todaysNutrition,
    loading,
    error,
    generateDailySummary,
  } = useNutritionTracking();

  const [lastSummaryTime, setLastSummaryTime] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    const summary = await generateDailySummary();
    if (summary) {
      Alert.alert('Daily Summary', summary);
      setLastSummaryTime(new Date().toISOString());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NutritionSummary
        nutritionData={todaysNutrition}
        loading={loading}
        error={error}
      />
      <Button
        title="Generate Daily Summary"
        onPress={handleGenerateSummary}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default App;
