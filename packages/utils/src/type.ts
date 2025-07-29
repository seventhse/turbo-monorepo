export type Dict<T = unknown> = Record<string, T>

export type Arrayable<T> = T | T[]

export type MaybePromise<T> = T | Promise<T>

export interface BaseOptionItem {
  label?: string
  value: string
}

export type Args<T extends any[] = any[]> = T
export type Fn<A extends any[] = any[], R = any> = (...args: Args<A>) => R
