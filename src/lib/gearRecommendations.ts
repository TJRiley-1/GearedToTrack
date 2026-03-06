import type { RiderLevel, GearRecommendation } from '../types'

/**
 * Static gear recommendation lookup table
 * Sourced from BC coaching guides and common track cycling practice
 */
const RECOMMENDATIONS: GearRecommendation[] = [
  // Sprint — 250m track
  { eventType: 'Sprint', level: 'beginner', trackLengthBucket: 250, minRatio: 3.0, maxRatio: 3.4, typicalChainring: 48, typicalSprocket: 15, notes: 'Start with a manageable gear you can spin up quickly' },
  { eventType: 'Sprint', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.4, maxRatio: 3.8, typicalChainring: 49, typicalSprocket: 14, notes: 'Balance between acceleration and top speed' },
  { eventType: 'Sprint', level: 'advanced', trackLengthBucket: 250, minRatio: 3.7, maxRatio: 4.1, typicalChainring: 51, typicalSprocket: 13, notes: 'Higher gear for peak power output' },
  { eventType: 'Sprint', level: 'elite', trackLengthBucket: 250, minRatio: 4.0, maxRatio: 4.5, typicalChainring: 54, typicalSprocket: 13, notes: 'Maximise top-end speed' },
  // Sprint — 333m track
  { eventType: 'Sprint', level: 'beginner', trackLengthBucket: 333, minRatio: 3.0, maxRatio: 3.4, typicalChainring: 48, typicalSprocket: 15, notes: 'Longer track, same gear works due to banking' },
  { eventType: 'Sprint', level: 'intermediate', trackLengthBucket: 333, minRatio: 3.3, maxRatio: 3.7, typicalChainring: 48, typicalSprocket: 14, notes: 'Slightly lower than 250m due to longer distance' },
  { eventType: 'Sprint', level: 'advanced', trackLengthBucket: 333, minRatio: 3.6, maxRatio: 4.0, typicalChainring: 50, typicalSprocket: 13, notes: 'Higher gearing suits longer straights' },
  { eventType: 'Sprint', level: 'elite', trackLengthBucket: 333, minRatio: 3.9, maxRatio: 4.4, typicalChainring: 53, typicalSprocket: 13, notes: 'Maximise top-end for longer track' },

  // Flying Lap — 250m
  { eventType: 'Flying Lap', level: 'beginner', trackLengthBucket: 250, minRatio: 3.1, maxRatio: 3.5, typicalChainring: 49, typicalSprocket: 15, notes: 'Rolling start — can use slightly bigger gear than standing sprint' },
  { eventType: 'Flying Lap', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.5, maxRatio: 3.9, typicalChainring: 51, typicalSprocket: 14, notes: 'High cadence maintenance is key' },
  { eventType: 'Flying Lap', level: 'advanced', trackLengthBucket: 250, minRatio: 3.8, maxRatio: 4.2, typicalChainring: 52, typicalSprocket: 13, notes: 'Maximise speed over single lap' },
  { eventType: 'Flying Lap', level: 'elite', trackLengthBucket: 250, minRatio: 4.1, maxRatio: 4.6, typicalChainring: 55, typicalSprocket: 13, notes: 'Top gear for peak velocity' },

  // Individual Pursuit — 250m
  { eventType: 'Individual Pursuit', level: 'beginner', trackLengthBucket: 250, minRatio: 2.8, maxRatio: 3.2, typicalChainring: 48, typicalSprocket: 16, notes: 'Sustain a steady cadence of 100-105 RPM' },
  { eventType: 'Individual Pursuit', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.1, maxRatio: 3.5, typicalChainring: 49, typicalSprocket: 15, notes: 'Target 105-110 RPM at race pace' },
  { eventType: 'Individual Pursuit', level: 'advanced', trackLengthBucket: 250, minRatio: 3.3, maxRatio: 3.7, typicalChainring: 51, typicalSprocket: 15, notes: 'Maintain high cadence over 4km' },
  { eventType: 'Individual Pursuit', level: 'elite', trackLengthBucket: 250, minRatio: 3.5, maxRatio: 3.9, typicalChainring: 53, typicalSprocket: 15, notes: 'Optimal power:aero balance at 110+ RPM' },

  // Individual Pursuit — 333m
  { eventType: 'Individual Pursuit', level: 'beginner', trackLengthBucket: 333, minRatio: 2.7, maxRatio: 3.1, typicalChainring: 47, typicalSprocket: 16, notes: 'Slightly smaller gear for outdoor/larger tracks' },
  { eventType: 'Individual Pursuit', level: 'intermediate', trackLengthBucket: 333, minRatio: 3.0, maxRatio: 3.4, typicalChainring: 48, typicalSprocket: 15, notes: 'Adjust for longer lap distance' },
  { eventType: 'Individual Pursuit', level: 'advanced', trackLengthBucket: 333, minRatio: 3.2, maxRatio: 3.6, typicalChainring: 50, typicalSprocket: 15, notes: 'Good cadence range for 333m laps' },
  { eventType: 'Individual Pursuit', level: 'elite', trackLengthBucket: 333, minRatio: 3.4, maxRatio: 3.8, typicalChainring: 52, typicalSprocket: 15, notes: 'Elite endurance gearing' },

  // Keirin — 250m
  { eventType: 'Keirin', level: 'beginner', trackLengthBucket: 250, minRatio: 3.0, maxRatio: 3.4, typicalChainring: 48, typicalSprocket: 15, notes: 'Need to accelerate from derny pace' },
  { eventType: 'Keirin', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.3, maxRatio: 3.7, typicalChainring: 49, typicalSprocket: 14, notes: 'Balance sprint power and acceleration' },
  { eventType: 'Keirin', level: 'advanced', trackLengthBucket: 250, minRatio: 3.6, maxRatio: 4.0, typicalChainring: 50, typicalSprocket: 13, notes: 'Higher gear for explosive finish' },
  { eventType: 'Keirin', level: 'elite', trackLengthBucket: 250, minRatio: 3.9, maxRatio: 4.3, typicalChainring: 52, typicalSprocket: 13, notes: 'Maximum sprint gearing' },

  // Points Race / Scratch Race / Elimination — 250m (endurance events share similar gearing)
  { eventType: 'Points Race', level: 'beginner', trackLengthBucket: 250, minRatio: 2.8, maxRatio: 3.2, typicalChainring: 48, typicalSprocket: 16, notes: 'Need to sustain effort and sprint intermittently' },
  { eventType: 'Points Race', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.0, maxRatio: 3.4, typicalChainring: 49, typicalSprocket: 15, notes: 'Versatile gear for bunch racing' },
  { eventType: 'Points Race', level: 'advanced', trackLengthBucket: 250, minRatio: 3.2, maxRatio: 3.6, typicalChainring: 50, typicalSprocket: 15, notes: 'Sprint capability with endurance base' },
  { eventType: 'Points Race', level: 'elite', trackLengthBucket: 250, minRatio: 3.4, maxRatio: 3.8, typicalChainring: 51, typicalSprocket: 14, notes: 'Elite bunch race gearing' },

  { eventType: 'Scratch Race', level: 'beginner', trackLengthBucket: 250, minRatio: 2.8, maxRatio: 3.2, typicalChainring: 48, typicalSprocket: 16, notes: 'Stay with the bunch, conserve for sprint' },
  { eventType: 'Scratch Race', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.0, maxRatio: 3.4, typicalChainring: 49, typicalSprocket: 15, notes: 'Good all-round endurance gear' },
  { eventType: 'Scratch Race', level: 'advanced', trackLengthBucket: 250, minRatio: 3.2, maxRatio: 3.6, typicalChainring: 50, typicalSprocket: 15, notes: 'Strong acceleration for attacks' },
  { eventType: 'Scratch Race', level: 'elite', trackLengthBucket: 250, minRatio: 3.4, maxRatio: 3.8, typicalChainring: 51, typicalSprocket: 14, notes: 'Elite endurance race gearing' },

  { eventType: 'Elimination Race', level: 'beginner', trackLengthBucket: 250, minRatio: 2.9, maxRatio: 3.3, typicalChainring: 48, typicalSprocket: 16, notes: 'Need quick acceleration for each sprint' },
  { eventType: 'Elimination Race', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.1, maxRatio: 3.5, typicalChainring: 49, typicalSprocket: 15, notes: 'Sprint-focused endurance gear' },
  { eventType: 'Elimination Race', level: 'advanced', trackLengthBucket: 250, minRatio: 3.3, maxRatio: 3.7, typicalChainring: 50, typicalSprocket: 14, notes: 'Repeated sprint capability' },
  { eventType: 'Elimination Race', level: 'elite', trackLengthBucket: 250, minRatio: 3.5, maxRatio: 3.9, typicalChainring: 51, typicalSprocket: 14, notes: 'Elite elimination gearing' },

  // Time Trial — 250m
  { eventType: 'Time Trial', level: 'beginner', trackLengthBucket: 250, minRatio: 2.8, maxRatio: 3.2, typicalChainring: 48, typicalSprocket: 16, notes: 'Steady-state effort, prioritise consistency' },
  { eventType: 'Time Trial', level: 'intermediate', trackLengthBucket: 250, minRatio: 3.1, maxRatio: 3.5, typicalChainring: 49, typicalSprocket: 15, notes: 'Sustainable power at 100-105 RPM' },
  { eventType: 'Time Trial', level: 'advanced', trackLengthBucket: 250, minRatio: 3.3, maxRatio: 3.7, typicalChainring: 51, typicalSprocket: 15, notes: 'Higher cadence TT effort' },
  { eventType: 'Time Trial', level: 'elite', trackLengthBucket: 250, minRatio: 3.5, maxRatio: 3.9, typicalChainring: 53, typicalSprocket: 15, notes: 'Optimal TT gearing at 110+ RPM' },
]

/**
 * Get closest track length bucket (250 or 333)
 */
function getTrackBucket(trackLength: number): number {
  return trackLength <= 290 ? 250 : 333
}

/**
 * Get gear recommendation for a given event, rider level, and track length
 */
export function getGearRecommendation(
  eventType: string,
  level: RiderLevel,
  trackLength: number
): GearRecommendation | null {
  const bucket = getTrackBucket(trackLength)

  // Try exact match first
  let rec = RECOMMENDATIONS.find(
    (r) => r.eventType === eventType && r.level === level && r.trackLengthBucket === bucket
  )

  // Fall back to 250m bucket if no match for this track
  if (!rec) {
    rec = RECOMMENDATIONS.find(
      (r) => r.eventType === eventType && r.level === level && r.trackLengthBucket === 250
    )
  }

  return rec ?? null
}

/**
 * Get all recommendations for a given event type (all levels)
 */
export function getEventRecommendations(
  eventType: string,
  trackLength: number
): GearRecommendation[] {
  const bucket = getTrackBucket(trackLength)
  const recs = RECOMMENDATIONS.filter(
    (r) => r.eventType === eventType && r.trackLengthBucket === bucket
  )

  // Fall back to 250m if nothing found
  if (recs.length === 0) {
    return RECOMMENDATIONS.filter(
      (r) => r.eventType === eventType && r.trackLengthBucket === 250
    )
  }

  return recs
}

/**
 * Event types that have gear recommendation data
 */
export const RECOMMENDED_EVENTS = [
  ...new Set(RECOMMENDATIONS.map((r) => r.eventType)),
]
