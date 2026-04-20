const CLOUD_FUNCTION_URL = 'https://us-central1-virtual-prompt-war-493720.cloudfunctions.net/predictCrowdDensity';

export const predictCrowdDensity = async (zone, density) => {
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone, currentDensity: density }),
    });
    return await response.json();
  } catch (error) {
    console.error('Cloud Function error:', error);
    return null;
  }
};