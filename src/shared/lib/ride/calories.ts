/** Примерный расход ккал (MET × вес × часы) */
export function estimateCalories(
  movingSec: number,
  distanceKm: number,
  weightKg = 72,
): number {
  if (movingSec <= 0) return 0
  const hours = movingSec / 3600
  let met = 4
  if (distanceKm > 40) met = 7
  else if (distanceKm > 25) met = 6
  else if (distanceKm > 12) met = 5
  return Math.round(met * weightKg * hours)
}
