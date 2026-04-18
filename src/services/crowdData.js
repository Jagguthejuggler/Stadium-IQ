/**
 * Simulates real-time crowd data for the application.
 * In a real scenario, this would use Firebase Realtime DB listeners.
 */

export const INITIAL_CROWD_DATA = {
  gates: {
    "Gate A": "LOW",
    "Gate B": "HIGH",
    "Gate C": "LOW",
    "Gate D": "MEDIUM",
  },
  foodStalls: {
    "Stall A": "HIGH",
    "Stall B": "LOW",
    "Stall C": "MEDIUM",
    "Stall D": "LOW",
  },
  facilities: {
    "Toilets Near A": "LOW",
    "Toilets Near C": "HIGH",
  }
};

export const CROWD_WAIT_TIMES = {
  "LOW": 5,
  "MEDIUM": 15,
  "HIGH": 30
};

// A simple mock function to randomize data and simulate "Realtime Database"
export const generateMockCrowdData = () => {
  const levels = ["LOW", "MEDIUM", "HIGH"];
  const randomLevel = () => levels[Math.floor(Math.random() * levels.length)];
  
  return {
    gates: {
      "Gate A": randomLevel(),
      "Gate B": randomLevel(),
      "Gate C": randomLevel(),
      "Gate D": randomLevel(),
    },
    foodStalls: {
      "Stall A": randomLevel(),
      "Stall B": randomLevel(),
      "Stall C": randomLevel(),
      "Stall D": randomLevel(),
    },
    facilities: {
      "Toilets Near A": randomLevel(),
      "Toilets Near C": randomLevel(),
    }
  };
};
