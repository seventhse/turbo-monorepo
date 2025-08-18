/**
 * Ensures the input value is returned as an array.
 *
 * If the input is `null` or `undefined` (but not zero), returns an empty array.
 * If the input is already an array, returns it as-is.
 * Otherwise, wraps the value in a new array.
 *
 * @template T - The type of the input value.
 * @param {T} val - The input value which can be of any type.
 * @returns {T[]} An array containing the input value, or an empty array if input is nullish.
 */
export function safeArray<T>(val: T): T[] {
  if (val !== 0 && !val) {
    return []
  }
  return Array.isArray(val) ? val : [val]
}
