import { isPlainObject } from './check-type'

export function safeObject<T>(value: T): T {
  if (isPlainObject(value)) {
    return value
  }
  return {} as T
}

export function isEmptyObject(value: unknown): boolean {
  return isPlainObject(value) && Object.keys(value).length === 0
}
