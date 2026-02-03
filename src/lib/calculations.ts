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
