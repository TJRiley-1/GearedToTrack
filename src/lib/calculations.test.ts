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
