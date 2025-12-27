import { createOrUpdateSteps } from '../../../api/steps-api/stepApi';
import { loadTodaySteps } from '../../../store/storage';

let lastSyncedSteps = 0;

/**
 * Sync steps to backend if threshold crossed
 */
export const syncStepsIfNeeded = async () => {
  const currentSteps = loadTodaySteps();

  // Avoid unnecessary calls
  if (currentSteps - lastSyncedSteps < 50) return;

  try {
    await createOrUpdateSteps({
      steps_count: currentSteps,
    });

    lastSyncedSteps = currentSteps;
    console.log('[STEPS SYNCED]', currentSteps);
  } catch (error) {
    console.log('[STEPS SYNC FAILED]', error);
  }
};

/**
 * Force sync (used on background / exit)
 */
export const forceSyncSteps = async () => {
  const currentSteps = loadTodaySteps();

  try {
    await createOrUpdateSteps({
      steps_count: currentSteps,
    });

    lastSyncedSteps = currentSteps;
    console.log('[STEPS FORCE SYNCED]', currentSteps);
  } catch (error) {
    console.log('[STEPS FORCE SYNC FAILED]', error);
  }
};
