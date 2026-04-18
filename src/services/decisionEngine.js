import { CROWD_WAIT_TIMES } from './crowdData';

/**
 * Helper to calculate wait time based on congestion level
 * @param {string} level - "LOW", "MEDIUM", or "HIGH"
 * @returns {number} Wait time in minutes
 */
const getWaitTime = (level) => CROWD_WAIT_TIMES[level] || 30;

/**
 * Recommends the best entry gate based on current crowd data.
 * @param {Object} crowdData - Current snapshot of the stadium's crowd data
 * @param {string} currentLocation - E.g., 'Metro Station', 'North Parking'
 * @returns {Object} Structured recommendation
 */
export const recommendGate = (crowdData, currentLocation = null) => {
  const gates = crowdData.gates;
  if (!gates) return null;

  let bestGate = null;
  let minWaitTime = Infinity;

  Object.entries(gates).forEach(([gateName, level]) => {
    const time = getWaitTime(level);
    if (time < minWaitTime) {
      minWaitTime = time;
      bestGate = gateName;
    }
  });

  return {
    recommendation: bestGate,
    waitTime: `${minWaitTime} mins`,
    reason: `Lowest congestion ${minWaitTime <= 5 ? '(Fastest entry)' : '(Relatively better)'}`
  };
};

/**
 * Recommends the best food stall based on current crowd data.
 * @param {Object} crowdData 
 * @param {string} currentZone 
 * @returns {Object} 
 */
export const recommendFoodStall = (crowdData, currentZone = null) => {
  const stalls = crowdData.foodStalls;
  if (!stalls) return null;

  let bestStall = null;
  let minWaitTime = Infinity;

  // In a real app we would compute distance from currentZone to the stall.
  Object.entries(stalls).forEach(([stallName, level]) => {
    const time = getWaitTime(level);
    if (time < minWaitTime) {
      minWaitTime = time;
      bestStall = stallName;
    }
  });

  return {
    recommendation: bestStall,
    waitTime: `${minWaitTime} mins`,
    reason: `Fastest service available nearby.`
  };
};

/**
 * Recommends the navigation route for a seat based on congestion.
 * Navigation mapping: A-D -> Gate A, E-H -> Gate B, I-L -> Gate C, M+ -> Gate D 
 * @param {Object} crowdData 
 * @param {string} seatNumber - e.g. "K-34"
 * @returns {Object} 
 */
export const recommendRoute = (crowdData, seatNumber) => {
  if (!seatNumber || !seatNumber.includes('-')) {
    return {
      recommendation: "Unknown Route",
      waitTime: "N/A",
      reason: "Invalid seat number."
    };
  }

  const block = seatNumber.charAt(0).toUpperCase();
  let primaryGate = "";

  if (block >= 'A' && block <= 'D') primaryGate = 'Gate A';
  else if (block >= 'E' && block <= 'H') primaryGate = 'Gate B';
  else if (block >= 'I' && block <= 'L') primaryGate = 'Gate C';
  else primaryGate = 'Gate D';

  const defaultWait = getWaitTime(crowdData.gates[primaryGate]);

  // If the primary gate is 'HIGH' (30 mins), we strongly suggest the globally best gate as an alternative route
  if (defaultWait === 30) {
    const bestAlternative = recommendGate(crowdData);
    if (bestAlternative.recommendation !== primaryGate) {
      return {
        recommendation: bestAlternative.recommendation + ` (Walk to Block ${block} inside)`,
        waitTime: bestAlternative.waitTime,
        reason: `Your primary ${primaryGate} is heavily congested. Taking this alternative route saves time.`
      };
    }
  }

  return {
    recommendation: primaryGate,
    waitTime: `${defaultWait} mins`,
    reason: `Standard suggested route for seat ${seatNumber}.`
  };
};
