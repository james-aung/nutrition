import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NutritionData } from '../types';

interface Props {
  nutritionData: NutritionData | null;
  loading: boolean;
  error: string | null;
}

export const NutritionSummary: React.FC<Props> = ({ nutritionData, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" testID="loading-indicator" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!nutritionData) {
    return (
      <View style={styles.container}>
        <Text>No nutrition data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Nutrition</Text>
      <View style={styles.dataContainer}>
        <View style={styles.dataItem}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>{Math.round(nutritionData.calories)}</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.label}>Protein</Text>
          <Text style={styles.value}>{Math.round(nutritionData.protein)}g</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.label}>Carbs</Text>
          <Text style={styles.value}>{Math.round(nutritionData.carbohydrates)}g</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.label}>Fat</Text>
          <Text style={styles.value}>{Math.round(nutritionData.fat)}g</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
}); 