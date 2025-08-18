import type { Args, Fn } from './type'

const toString = Object.prototype.toString

export function isString(val: unknown): val is string {
  return toString.call(val) === '[object String]'
}

export function isNumber(val: unknown): val is number {
  return toString.call(val) === '[object Number]' && !Number.isNaN(val as number)
}

export function isBoolean(val: unknown): val is boolean {
  return toString.call(val) === '[object Boolean]'
}

export function isArray(val: unknown): val is any[] {
  return toString.call(val) === '[object Array]'
}

export function isFunction<T extends any[] = any[], R = any>(val: unknown): val is Fn<Args<T>, R> {
  return toString.call(val) === '[object Function]'
}

export function isDate(val: unknown): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isPlainObject(val: unknown): val is Record<string, any> {
  return toString.call(val) === '[object Object]'
}
