import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { monthlyMetrics, aiHumanMetrics } from '@/mocks/metrics';

// KPI selectors derived from state
export const selectKpis = createSelector(
  [(state: RootState) => state.users.items, (state: RootState) => state.images.items],
  (users, images) => {
    const totalUsers = users.length;
    const totalImages = images.length;
    const imagesValidated = images.filter(img => img.violations.length > 0).length;
    const violationsValidated = images.reduce((sum, img) => sum + img.violations.length, 0);

    return {
      totalUsers,
      totalImages,
      imagesValidated,
      violationsValidated,
    };
  }
);

// Monthly data selectors (from mock)
export const selectUsersByMonth = () => monthlyMetrics;

export const selectImagesTotalsByMonth = () => monthlyMetrics.map(item => ({
  month: item.month,
  totalImages: item.totalImages,
  validatedImages: item.validatedImages,
}));

// AI vs Human delta
export const selectAiHumanDelta = () => aiHumanMetrics;