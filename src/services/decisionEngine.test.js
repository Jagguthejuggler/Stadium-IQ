import { describe, it, expect } from 'vitest';
import { recommendGate, recommendRoute, recommendFoodStall } from './decisionEngine';

const MOCK_DATA = {
  gates: {
    "Gate A": "HIGH",
    "Gate B": "MEDIUM",
    "Gate C": "LOW",
    "Gate D": "HIGH"
  },
  foodStalls: {
    "Stall A": "HIGH",
    "Stall B": "HIGH",
    "Stall C": "HIGH",
    "Stall D": "HIGH"
  }
};

describe('Decision Engine', () => {
  it('should recommend the gate with LOW congestion', () => {
    const result = recommendGate(MOCK_DATA);
    expect(result.recommendation).toBe("Gate C");
    expect(result.waitTime).toBe("5 mins");
  });

  it('should handle all HIGH congestion gracefully by picking the first equivalent worst gate but with correct wait time', () => {
    const ALL_HIGH_DATA = { gates: { "Gate A": "HIGH", "Gate B": "HIGH" }};
    const result = recommendGate(ALL_HIGH_DATA);
    expect(result.recommendation).toBe("Gate A"); // First one evaluated 
    expect(result.waitTime).toBe("30 mins");
  });

  it('should handle food stall logic for all HIGH congestion', () => {
    const result = recommendFoodStall(MOCK_DATA);
    expect(result.recommendation).toBe("Stall A");
    expect(result.waitTime).toBe("30 mins");
  });

  it('should override primary gate in route navigation if primary is HIGH and another is LOW', () => {
    // Seat 'A-5' prefers Gate A. Gate A is HIGH, Gate C is LOW in MOCK_DATA.
    const result = recommendRoute(MOCK_DATA, "A-5");
    expect(result.recommendation).toContain("Gate C");
    expect(result.reason).toContain("heavily congested");
  });

  it('should keep primary gate in route navigation if primary is LOW or MEDIUM', () => {
    // Seat 'I-45' prefers Gate C. Gate C is LOW.
    const result = recommendRoute(MOCK_DATA, "I-45");
    expect(result.recommendation).toBe("Gate C");
    expect(result.waitTime).toBe("5 mins");
  });
});
