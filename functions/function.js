exports.predictCrowdDensity = async (req, res) => {
  const { zone, currentDensity } = req.body;

  if (!zone || currentDensity === undefined) {
    return res.status(400).json({ error: 'Missing zone or currentDensity' });
  }

  // Simple ML prediction logic
  const prediction = currentDensity * 1.15; // Assume 15% growth
  const alert = prediction > 80 ? 'HIGH' : prediction > 50 ? 'MEDIUM' : 'LOW';

  res.json({
    zone,
    predictedDensity: Math.min(prediction, 100),
    alert,
    recommendation: alert === 'HIGH' ? 'Redirect traffic immediately' : 'Monitor closely',
  });
};