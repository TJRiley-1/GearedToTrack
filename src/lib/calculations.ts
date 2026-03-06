/**
 * Gear ratio calculations for track cycling
 */

/**
 * Calculate gear ratio (chainring teeth / sprocket teeth)
 */
export function calculateRatio(chainringTeeth: number, sprocketTeeth: number): number {
  return chainringTeeth / sprocketTeeth
}

/**
 * Calculate gear inches
 * Formula: ratio × (wheel_diameter_mm / 25.4)
 * Common wheel diameter for track: 668mm (700c with 23mm tire)
 */
export function calculateGearInches(
  chainringTeeth: number,
  sprocketTeeth: number,
  wheelDiameterMm: number = 668
): number {
  const ratio = calculateRatio(chainringTeeth, sprocketTeeth)
  return ratio * (wheelDiameterMm / 25.4)
}

/**
 * Calculate development (meters per revolution)
 * Formula: wheel_circumference × ratio
 */
export function calculateDevelopment(
  chainringTeeth: number,
  sprocketTeeth: number,
  wheelDiameterMm: number = 668
): number {
  const ratio = calculateRatio(chainringTeeth, sprocketTeeth)
  const wheelCircumference = Math.PI * wheelDiameterMm / 1000 // Convert to meters
  return wheelCircumference * ratio
}

/**
 * Calculate speed at a given cadence
 * Returns speed in km/h
 */
export function calculateSpeed(
  chainringTeeth: number,
  sprocketTeeth: number,
  cadenceRpm: number,
  wheelDiameterMm: number = 668
): number {
  const development = calculateDevelopment(chainringTeeth, sprocketTeeth, wheelDiameterMm)
  const metersPerMinute = development * cadenceRpm
  const kmPerHour = metersPerMinute * 60 / 1000
  return kmPerHour
}

/**
 * Calculate cadence needed for a target speed
 * Returns cadence in RPM
 */
export function calculateCadence(
  chainringTeeth: number,
  sprocketTeeth: number,
  speedKmh: number,
  wheelDiameterMm: number = 668
): number {
  const development = calculateDevelopment(chainringTeeth, sprocketTeeth, wheelDiameterMm)
  const metersPerMinute = speedKmh * 1000 / 60
  return metersPerMinute / development
}

/**
 * Format time in milliseconds to display format
 * Input: time in ms
 * Output: "SS.mmm" or "M:SS.mmm"
 */
export function formatTime(timeMs: number): string {
  const totalSeconds = timeMs / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`
  }
  return seconds.toFixed(3)
}

/**
 * Parse time string to milliseconds
 * Input: "SS.mmm" or "M:SS.mmm" or "MM:SS.mmm"
 * Output: time in ms
 */
export function parseTime(timeStr: string): number | null {
  const trimmed = timeStr.trim()

  // Handle M:SS.mmm or MM:SS.mmm format
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':')
    if (parts.length !== 2) return null

    const minutes = parseInt(parts[0], 10)
    const seconds = parseFloat(parts[1])

    if (isNaN(minutes) || isNaN(seconds)) return null
    if (minutes < 0 || seconds < 0 || seconds >= 60) return null

    return (minutes * 60 + seconds) * 1000
  }

  // Handle SS.mmm format
  const seconds = parseFloat(trimmed)
  if (isNaN(seconds) || seconds < 0) return null

  return seconds * 1000
}

/**
 * Calculate average lap time from an array of times
 */
export function calculateAverageTime(timesMs: number[]): number | null {
  if (timesMs.length === 0) return null
  const sum = timesMs.reduce((acc, time) => acc + time, 0)
  return sum / timesMs.length
}

/**
 * Calculate best (fastest) lap time
 */
export function calculateBestTime(timesMs: number[]): number | null {
  if (timesMs.length === 0) return null
  return Math.min(...timesMs)
}

/**
 * Greatest common divisor (for skid patches)
 */
function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/**
 * Calculate skid patches for a fixed gear
 * The number of distinct contact points on the tire when skidding
 */
export function calculateSkidPatches(chainring: number, sprocket: number): number {
  return sprocket / gcd(chainring, sprocket)
}

/**
 * Estimate power from lap time using simplified physics model
 * P_total = P_aero + P_rolling
 * P_aero = 0.5 * rho * CdA * v^3
 * P_rolling = Crr * m * g * v
 */
export function estimatePower(inputs: {
  timeSeconds: number
  distanceMeters: number
  riderWeightKg: number
  bikeWeightKg?: number
  cdA?: number
  crr?: number
  airDensity?: number
}): {
  totalWatts: number
  wattsPerKg: number
  aeroPower: number
  rollingPower: number
  speedMs: number
  speedKmh: number
} {
  const bikeWeight = inputs.bikeWeightKg ?? 8
  const cdA = inputs.cdA ?? 0.32
  const crr = inputs.crr ?? 0.002
  const rho = inputs.airDensity ?? 1.2
  const g = 9.81

  const totalMass = inputs.riderWeightKg + bikeWeight
  const speedMs = inputs.distanceMeters / inputs.timeSeconds
  const speedKmh = speedMs * 3.6

  const aeroPower = 0.5 * rho * cdA * Math.pow(speedMs, 3)
  const rollingPower = crr * totalMass * g * speedMs

  const totalWatts = aeroPower + rollingPower
  const wattsPerKg = totalWatts / inputs.riderWeightKg

  return { totalWatts, wattsPerKg, aeroPower, rollingPower, speedMs, speedKmh }
}

/**
 * Calculate even splits for a target time
 */
export function calculateEvenSplits(targetMs: number, lapCount: number): number[] {
  if (lapCount <= 0) return []
  const perLap = targetMs / lapCount
  return Array.from({ length: lapCount }, () => perLap)
}

/**
 * Calculate negative splits (get faster each lap)
 * aggression 0-1 controls how much faster later laps are
 */
export function calculateNegativeSplits(
  targetMs: number,
  lapCount: number,
  aggression: number = 0.5
): number[] {
  if (lapCount <= 0) return []
  if (lapCount === 1) return [targetMs]

  // Linear decrease: first lap is slowest, last lap is fastest
  // The spread is controlled by aggression (0 = even, 1 = max spread)
  const evenSplit = targetMs / lapCount
  const maxSpread = evenSplit * 0.3 * aggression // up to 30% spread at full aggression

  const splits: number[] = []
  for (let i = 0; i < lapCount; i++) {
    // Linearly interpolate from +spread to -spread
    const factor = 1 - (2 * i) / (lapCount - 1)
    splits.push(evenSplit + maxSpread * factor)
  }

  // Normalize to ensure total matches target exactly
  const total = splits.reduce((a, b) => a + b, 0)
  const scale = targetMs / total
  return splits.map((s) => s * scale)
}

/**
 * Calculate progressive splits (get slower each lap — front-loaded effort)
 * aggression 0-1 controls how much faster early laps are
 */
export function calculateProgressiveSplits(
  targetMs: number,
  lapCount: number,
  aggression: number = 0.5
): number[] {
  if (lapCount <= 0) return []
  if (lapCount === 1) return [targetMs]

  const evenSplit = targetMs / lapCount
  const maxSpread = evenSplit * 0.3 * aggression

  const splits: number[] = []
  for (let i = 0; i < lapCount; i++) {
    const factor = (2 * i) / (lapCount - 1) - 1
    splits.push(evenSplit + maxSpread * factor)
  }

  const total = splits.reduce((a, b) => a + b, 0)
  const scale = targetMs / total
  return splits.map((s) => s * scale)
}
