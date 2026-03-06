import { describe, it, expect } from 'vitest'
import {
  calculateRatio,
  calculateGearInches,
  calculateDevelopment,
  calculateSpeed,
  calculateCadence,
  formatTime,
  parseTime,
  calculateAverageTime,
  calculateBestTime,
  calculateSkidPatches,
  estimatePower,
  calculateEvenSplits,
  calculateNegativeSplits,
  calculateProgressiveSplits,
} from './calculations'

describe('calculateRatio', () => {
  it('calculates ratio correctly', () => {
    expect(calculateRatio(50, 14)).toBeCloseTo(3.571, 2)
    expect(calculateRatio(49, 15)).toBeCloseTo(3.267, 2)
  })

  it('returns 1 for equal teeth', () => {
    expect(calculateRatio(15, 15)).toBe(1)
  })
})

describe('calculateGearInches', () => {
  it('calculates gear inches with default wheel diameter', () => {
    const result = calculateGearInches(50, 14)
    expect(result).toBeCloseTo(93.88, 1)
  })

  it('calculates gear inches with custom wheel diameter', () => {
    const result = calculateGearInches(50, 14, 700)
    expect(result).toBeCloseTo(98.43, 1)
  })
})

describe('calculateDevelopment', () => {
  it('calculates development in meters per revolution', () => {
    const result = calculateDevelopment(50, 14)
    // 50/14 * pi * 0.668
    expect(result).toBeCloseTo(7.49, 1)
  })

  it('uses custom wheel diameter', () => {
    const result = calculateDevelopment(50, 14, 700)
    expect(result).toBeCloseTo(7.85, 1)
  })
})

describe('calculateSpeed', () => {
  it('calculates speed in km/h', () => {
    const result = calculateSpeed(50, 14, 100)
    // development * 100 * 60 / 1000
    expect(result).toBeGreaterThan(40)
    expect(result).toBeLessThan(50)
  })

  it('returns 0 at 0 cadence', () => {
    expect(calculateSpeed(50, 14, 0)).toBe(0)
  })
})

describe('calculateCadence', () => {
  it('calculates cadence for a given speed', () => {
    const speed = calculateSpeed(50, 14, 100)
    const cadence = calculateCadence(50, 14, speed)
    expect(cadence).toBeCloseTo(100, 0)
  })

  it('returns 0 for 0 speed', () => {
    expect(calculateCadence(50, 14, 0)).toBe(0)
  })
})

describe('formatTime', () => {
  it('formats seconds only', () => {
    expect(formatTime(12345)).toBe('12.345')
  })

  it('formats with minutes', () => {
    expect(formatTime(83456)).toBe('1:23.456')
  })

  it('pads seconds when minutes present', () => {
    expect(formatTime(62345)).toBe('1:02.345')
  })

  it('formats zero', () => {
    expect(formatTime(0)).toBe('0.000')
  })
})

describe('parseTime', () => {
  it('parses seconds format', () => {
    expect(parseTime('12.345')).toBe(12345)
  })

  it('parses minutes:seconds format', () => {
    expect(parseTime('1:23.456')).toBe(83456)
  })

  it('handles whitespace', () => {
    expect(parseTime('  12.345  ')).toBe(12345)
  })

  it('returns null for invalid input', () => {
    expect(parseTime('abc')).toBeNull()
    expect(parseTime('')).toBeNull()
    expect(parseTime('1:2:3')).toBeNull()
  })

  it('returns null for negative values', () => {
    expect(parseTime('-5.000')).toBeNull()
  })

  it('returns null for seconds >= 60 in M:SS format', () => {
    expect(parseTime('1:60.000')).toBeNull()
  })
})

describe('calculateAverageTime', () => {
  it('calculates average', () => {
    expect(calculateAverageTime([10000, 12000, 11000])).toBeCloseTo(11000)
  })

  it('returns null for empty array', () => {
    expect(calculateAverageTime([])).toBeNull()
  })
})

describe('calculateBestTime', () => {
  it('returns fastest time', () => {
    expect(calculateBestTime([12000, 10000, 11000])).toBe(10000)
  })

  it('returns null for empty array', () => {
    expect(calculateBestTime([])).toBeNull()
  })
})

describe('calculateSkidPatches', () => {
  it('calculates skid patches for 49/15', () => {
    // GCD(49, 15) = 1, so patches = 15/1 = 15
    expect(calculateSkidPatches(49, 15)).toBe(15)
  })

  it('calculates skid patches for 48/16', () => {
    // GCD(48, 16) = 16, so patches = 16/16 = 1
    expect(calculateSkidPatches(48, 16)).toBe(1)
  })

  it('calculates skid patches for 50/14', () => {
    // GCD(50, 14) = 2, so patches = 14/2 = 7
    expect(calculateSkidPatches(50, 14)).toBe(7)
  })

  it('calculates skid patches for 51/14', () => {
    // GCD(51, 14) = 1, so patches = 14/1 = 14
    expect(calculateSkidPatches(51, 14)).toBe(14)
  })
})

describe('estimatePower', () => {
  it('estimates power for a typical flying lap', () => {
    const result = estimatePower({
      timeSeconds: 13.5,
      distanceMeters: 250,
      riderWeightKg: 75,
    })
    expect(result.totalWatts).toBeGreaterThan(200)
    expect(result.totalWatts).toBeLessThan(2000)
    expect(result.wattsPerKg).toBeCloseTo(result.totalWatts / 75)
    expect(result.speedKmh).toBeCloseTo(result.speedMs * 3.6)
    expect(result.aeroPower).toBeGreaterThan(result.rollingPower) // aero dominates at track speed
  })

  it('uses custom physics parameters', () => {
    const base = estimatePower({
      timeSeconds: 13.5,
      distanceMeters: 250,
      riderWeightKg: 75,
    })
    const aero = estimatePower({
      timeSeconds: 13.5,
      distanceMeters: 250,
      riderWeightKg: 75,
      cdA: 0.5, // worse aero position
    })
    expect(aero.totalWatts).toBeGreaterThan(base.totalWatts)
  })

  it('power increases with speed', () => {
    const slow = estimatePower({
      timeSeconds: 20,
      distanceMeters: 250,
      riderWeightKg: 75,
    })
    const fast = estimatePower({
      timeSeconds: 13,
      distanceMeters: 250,
      riderWeightKg: 75,
    })
    expect(fast.totalWatts).toBeGreaterThan(slow.totalWatts)
  })
})

describe('calculateEvenSplits', () => {
  it('splits evenly', () => {
    const splits = calculateEvenSplits(60000, 4)
    expect(splits).toHaveLength(4)
    expect(splits.every((s) => s === 15000)).toBe(true)
  })

  it('returns empty for 0 laps', () => {
    expect(calculateEvenSplits(60000, 0)).toHaveLength(0)
  })

  it('total matches target', () => {
    const splits = calculateEvenSplits(67890, 7)
    const total = splits.reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(67890, 0)
  })
})

describe('calculateNegativeSplits', () => {
  it('gets faster over laps', () => {
    const splits = calculateNegativeSplits(60000, 4, 0.5)
    expect(splits).toHaveLength(4)
    // First lap should be slowest, last should be fastest
    expect(splits[0]).toBeGreaterThan(splits[3])
  })

  it('total matches target', () => {
    const splits = calculateNegativeSplits(60000, 4, 0.8)
    const total = splits.reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(60000, 0)
  })

  it('single lap returns target time', () => {
    const splits = calculateNegativeSplits(15000, 1)
    expect(splits).toEqual([15000])
  })

  it('zero aggression gives even splits', () => {
    const splits = calculateNegativeSplits(60000, 4, 0)
    expect(splits.every((s) => Math.abs(s - 15000) < 0.01)).toBe(true)
  })
})

describe('calculateProgressiveSplits', () => {
  it('gets slower over laps (front-loaded)', () => {
    const splits = calculateProgressiveSplits(60000, 4, 0.5)
    expect(splits).toHaveLength(4)
    // First lap should be fastest, last should be slowest
    expect(splits[0]).toBeLessThan(splits[3])
  })

  it('total matches target', () => {
    const splits = calculateProgressiveSplits(60000, 4, 0.8)
    const total = splits.reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(60000, 0)
  })
})
