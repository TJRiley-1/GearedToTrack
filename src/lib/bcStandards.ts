import type { BCCategory, BCStandard } from '../types'

/**
 * British Cycling category standards
 * Times in milliseconds for standard track distances
 * Based on BC accreditation categories A-E
 *
 * Event distances:
 * - Flying Lap: 1 lap (250m/333m)
 * - Sprint: 200m (from flying start)
 * - Individual Pursuit: 4km (men) / 3km (women) — measured as total time
 * - Time Trial: 500m (women) / 1km (men)
 */

// Flying Lap 250m — Male
const STANDARDS: BCStandard[] = [
  // Flying Lap — Male — Senior
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'male', category: 'A', timeMs: 13000 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'male', category: 'B', timeMs: 14000 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'male', category: 'C', timeMs: 15500 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'male', category: 'D', timeMs: 17000 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'male', category: 'E', timeMs: 19000 },

  // Flying Lap — Female — Senior
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'female', category: 'A', timeMs: 14500 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'female', category: 'B', timeMs: 16000 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'female', category: 'C', timeMs: 17500 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'female', category: 'D', timeMs: 19500 },
  { eventType: 'Flying Lap', ageGroup: 'Senior', gender: 'female', category: 'E', timeMs: 22000 },

  // Flying Lap — Male — Youth (U16)
  { eventType: 'Flying Lap', ageGroup: 'Youth', gender: 'male', category: 'A', timeMs: 14500 },
  { eventType: 'Flying Lap', ageGroup: 'Youth', gender: 'male', category: 'B', timeMs: 15500 },
  { eventType: 'Flying Lap', ageGroup: 'Youth', gender: 'male', category: 'C', timeMs: 17000 },
  { eventType: 'Flying Lap', ageGroup: 'Youth', gender: 'male', category: 'D', timeMs: 18500 },
  { eventType: 'Flying Lap', ageGroup: 'Youth', gender: 'male', category: 'E', timeMs: 21000 },

  // Flying Lap — Male — Junior
  { eventType: 'Flying Lap', ageGroup: 'Junior', gender: 'male', category: 'A', timeMs: 13500 },
  { eventType: 'Flying Lap', ageGroup: 'Junior', gender: 'male', category: 'B', timeMs: 14500 },
  { eventType: 'Flying Lap', ageGroup: 'Junior', gender: 'male', category: 'C', timeMs: 16000 },
  { eventType: 'Flying Lap', ageGroup: 'Junior', gender: 'male', category: 'D', timeMs: 17500 },
  { eventType: 'Flying Lap', ageGroup: 'Junior', gender: 'male', category: 'E', timeMs: 20000 },

  // Flying Lap — Male — Masters (40+)
  { eventType: 'Flying Lap', ageGroup: 'Masters', gender: 'male', category: 'A', timeMs: 14000 },
  { eventType: 'Flying Lap', ageGroup: 'Masters', gender: 'male', category: 'B', timeMs: 15000 },
  { eventType: 'Flying Lap', ageGroup: 'Masters', gender: 'male', category: 'C', timeMs: 16500 },
  { eventType: 'Flying Lap', ageGroup: 'Masters', gender: 'male', category: 'D', timeMs: 18500 },
  { eventType: 'Flying Lap', ageGroup: 'Masters', gender: 'male', category: 'E', timeMs: 21000 },

  // Sprint (200m) — Male — Senior
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'male', category: 'A', timeMs: 10500 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'male', category: 'B', timeMs: 11200 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'male', category: 'C', timeMs: 12000 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'male', category: 'D', timeMs: 13000 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'male', category: 'E', timeMs: 14500 },

  // Sprint — Female — Senior
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'female', category: 'A', timeMs: 11500 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'female', category: 'B', timeMs: 12500 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'female', category: 'C', timeMs: 13500 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'female', category: 'D', timeMs: 14500 },
  { eventType: 'Sprint', ageGroup: 'Senior', gender: 'female', category: 'E', timeMs: 16000 },

  // Sprint — Male — Junior
  { eventType: 'Sprint', ageGroup: 'Junior', gender: 'male', category: 'A', timeMs: 11000 },
  { eventType: 'Sprint', ageGroup: 'Junior', gender: 'male', category: 'B', timeMs: 11800 },
  { eventType: 'Sprint', ageGroup: 'Junior', gender: 'male', category: 'C', timeMs: 12800 },
  { eventType: 'Sprint', ageGroup: 'Junior', gender: 'male', category: 'D', timeMs: 14000 },
  { eventType: 'Sprint', ageGroup: 'Junior', gender: 'male', category: 'E', timeMs: 15500 },

  // Sprint — Male — Masters
  { eventType: 'Sprint', ageGroup: 'Masters', gender: 'male', category: 'A', timeMs: 11200 },
  { eventType: 'Sprint', ageGroup: 'Masters', gender: 'male', category: 'B', timeMs: 12000 },
  { eventType: 'Sprint', ageGroup: 'Masters', gender: 'male', category: 'C', timeMs: 13000 },
  { eventType: 'Sprint', ageGroup: 'Masters', gender: 'male', category: 'D', timeMs: 14200 },
  { eventType: 'Sprint', ageGroup: 'Masters', gender: 'male', category: 'E', timeMs: 16000 },

  // Individual Pursuit (4km men) — Male — Senior
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'male', category: 'A', timeMs: 270000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'male', category: 'B', timeMs: 285000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'male', category: 'C', timeMs: 300000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'male', category: 'D', timeMs: 320000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'male', category: 'E', timeMs: 345000 },

  // Individual Pursuit (3km women) — Female — Senior
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'female', category: 'A', timeMs: 220000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'female', category: 'B', timeMs: 235000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'female', category: 'C', timeMs: 252000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'female', category: 'D', timeMs: 270000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Senior', gender: 'female', category: 'E', timeMs: 295000 },

  // Individual Pursuit — Male — Junior
  { eventType: 'Individual Pursuit', ageGroup: 'Junior', gender: 'male', category: 'A', timeMs: 280000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Junior', gender: 'male', category: 'B', timeMs: 295000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Junior', gender: 'male', category: 'C', timeMs: 315000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Junior', gender: 'male', category: 'D', timeMs: 335000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Junior', gender: 'male', category: 'E', timeMs: 360000 },

  // Individual Pursuit — Male — Masters
  { eventType: 'Individual Pursuit', ageGroup: 'Masters', gender: 'male', category: 'A', timeMs: 285000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Masters', gender: 'male', category: 'B', timeMs: 300000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Masters', gender: 'male', category: 'C', timeMs: 320000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Masters', gender: 'male', category: 'D', timeMs: 340000 },
  { eventType: 'Individual Pursuit', ageGroup: 'Masters', gender: 'male', category: 'E', timeMs: 370000 },

  // Time Trial (1km men) — Male — Senior
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'male', category: 'A', timeMs: 65000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'male', category: 'B', timeMs: 69000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'male', category: 'C', timeMs: 74000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'male', category: 'D', timeMs: 80000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'male', category: 'E', timeMs: 88000 },

  // Time Trial (500m women) — Female — Senior
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'female', category: 'A', timeMs: 36000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'female', category: 'B', timeMs: 39000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'female', category: 'C', timeMs: 42000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'female', category: 'D', timeMs: 46000 },
  { eventType: 'Time Trial', ageGroup: 'Senior', gender: 'female', category: 'E', timeMs: 51000 },

  // Time Trial — Male — Junior
  { eventType: 'Time Trial', ageGroup: 'Junior', gender: 'male', category: 'A', timeMs: 68000 },
  { eventType: 'Time Trial', ageGroup: 'Junior', gender: 'male', category: 'B', timeMs: 73000 },
  { eventType: 'Time Trial', ageGroup: 'Junior', gender: 'male', category: 'C', timeMs: 78000 },
  { eventType: 'Time Trial', ageGroup: 'Junior', gender: 'male', category: 'D', timeMs: 85000 },
  { eventType: 'Time Trial', ageGroup: 'Junior', gender: 'male', category: 'E', timeMs: 93000 },

  // Time Trial — Male — Masters
  { eventType: 'Time Trial', ageGroup: 'Masters', gender: 'male', category: 'A', timeMs: 69000 },
  { eventType: 'Time Trial', ageGroup: 'Masters', gender: 'male', category: 'B', timeMs: 74000 },
  { eventType: 'Time Trial', ageGroup: 'Masters', gender: 'male', category: 'C', timeMs: 80000 },
  { eventType: 'Time Trial', ageGroup: 'Masters', gender: 'male', category: 'D', timeMs: 87000 },
  { eventType: 'Time Trial', ageGroup: 'Masters', gender: 'male', category: 'E', timeMs: 96000 },
]

/**
 * Get the BC age group from an age
 */
export function getAgeGroup(age: number | null | undefined): string {
  if (age == null) return 'Senior'
  if (age < 16) return 'Youth'
  if (age < 19) return 'Junior'
  if (age >= 40) return 'Masters'
  return 'Senior'
}

/**
 * Get the achieved BC category for a given time
 * Returns the best (lowest letter) category the time qualifies for
 * Categories are thresholds: you achieve a category by being AT or UNDER the time
 */
export function getBCCategory(
  eventType: string,
  ageGroup: string,
  gender: 'male' | 'female',
  timeMs: number
): BCCategory | null {
  const standards = STANDARDS.filter(
    (s) => s.eventType === eventType && s.ageGroup === ageGroup && s.gender === gender
  ).sort((a, b) => a.timeMs - b.timeMs) // Sort by time ascending (A is fastest)

  if (standards.length === 0) return null

  // Find the best category where the user's time is at or under the threshold
  for (const standard of standards) {
    if (timeMs <= standard.timeMs) {
      return standard.category
    }
  }

  return null // Didn't meet any category
}

/**
 * Get all standards for a given event/age/gender combination
 */
export function getStandards(
  eventType: string,
  ageGroup: string,
  gender: 'male' | 'female'
): BCStandard[] {
  return STANDARDS.filter(
    (s) => s.eventType === eventType && s.ageGroup === ageGroup && s.gender === gender
  ).sort((a, b) => a.timeMs - b.timeMs)
}

/**
 * Event types that have BC standard data
 */
export const BC_STANDARD_EVENTS = [...new Set(STANDARDS.map((s) => s.eventType))]

/**
 * Available age groups
 */
export const BC_AGE_GROUPS = ['Youth', 'Junior', 'Senior', 'Masters']
