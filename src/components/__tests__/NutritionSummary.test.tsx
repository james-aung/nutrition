import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NutritionSummary } from '../NutritionSummary';

describe('NutritionSummary', () => {
  const mockNutritionData = {
    calories: 2000,
    protein: 80,
    carbohydrates: 250,
    fat: 65,
    date: '2024-02-11T12:00:00.000Z',
  };

  it('shows loading indicator when loading prop is true', () => {
    const { getByTestId } = render(
      <NutritionSummary
        nutritionData={null}
        loading={true}
        error={null}
      />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'Failed to load nutrition data';
    const { getByText } = render(
      <NutritionSummary
        nutritionData={null}
        loading={false}
        error={errorMessage}
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('shows "No nutrition data available" when nutritionData is null', () => {
    const { getByText } = render(
      <NutritionSummary
        nutritionData={null}
        loading={false}
        error={null}
      />
    );

    expect(getByText('No nutrition data available')).toBeTruthy();
  });

  it('displays nutrition data correctly when provided', () => {
    const { getByText } = render(
      <NutritionSummary
        nutritionData={mockNutritionData}
        loading={false}
        error={null}
      />
    );

    expect(getByText('2000')).toBeTruthy();
    expect(getByText('80g')).toBeTruthy();
    expect(getByText('250g')).toBeTruthy();
    expect(getByText('65g')).toBeTruthy();
  });
}); 