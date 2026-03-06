import type { EventType } from './database'

// === Personal Bests ===

export interface PersonalBest {
  eventType: EventType
  bestTimeMs: number
  sessionId: string
  sessionDate: string
  trackName: string | null
  trackLength: number
}

export interface PBHistoryPoint {
  sessionId: string
  sessionDate: string
  bestTimeMs: number
  trackName: string | null
  delta: number | null // difference from previous PB (negative = improvement)
}

// === Rider Levels ===

export type RiderLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite'

// === Gear Recommendations ===

export interface GearRecommendation {
  eventType: string
  level: RiderLevel
  trackLengthBucket: number // 250 or 333
  minRatio: number
  maxRatio: number
  typicalChainring: number
  typicalSprocket: number
  notes: string
}

// === Pacing ===

export type PacingStrategy = 'even' | 'negative' | 'progressive'

export interface LapSplit {
  lapNumber: number
  targetMs: number
  actualMs?: number
}

// === Power Estimation ===

export interface PowerInputs {
  timeSeconds: number
  distanceMeters: number
  riderWeightKg: number
  bikeWeightKg?: number // default 8
  cdA?: number // drag area, default 0.32 for track drops
  crr?: number // rolling resistance, default 0.002 for velodrome
  airDensity?: number // default 1.2 kg/m³
}

export interface PowerEstimate {
  totalWatts: number
  wattsPerKg: number
  aeroPower: number
  rollingPower: number
  speedMs: number
  speedKmh: number
}

// === BC Standards ===

export type BCCategory = 'A' | 'B' | 'C' | 'D' | 'E'

export interface BCStandard {
  eventType: string
  ageGroup: string
  gender: 'male' | 'female'
  category: BCCategory
  timeMs: number
}

// === Training Load ===

export interface WeeklyLoad {
  weekStart: string // ISO date of Monday
  sessionCount: number
  totalRpe: number
  averageRpe: number
  spikePercent: number | null // % increase vs previous week
  isSpikeAlert: boolean
}

// === Gear Comparison ===

export interface GearSetup {
  chainringTeeth: number
  sprocketTeeth: number
  label: string
}

export interface GearComparisonRow {
  cadence: number
  speedA: number
  speedB: number
}

// === Community Benchmarks ===

export interface CommunityBenchmark {
  eventType: string
  trackLength: number
  sampleSize: number
  p10Ms: number
  p25Ms: number
  p50Ms: number
  p75Ms: number
  p90Ms: number
  userBestMs: number | null
  userPercentile: number | null
}
