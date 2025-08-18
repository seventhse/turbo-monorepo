import type { Args } from '@vi-space/utils'
import type { ReactElement, ReactNode } from 'react'
import { isFunction, safeObject } from '@vi-space/utils'
import { Children, cloneElement, isValidElement } from 'react'

export type CustomChildren<T extends any[] = any[]> = ((...args: Args<T>) => ReactNode) | ReactNode

export function renderChildren<T extends any[] = any[]>(children?: CustomChildren<T>, ...args: T): ReactNode {
  if (!children) {
    return null
  }

  if (isFunction(children)) {
    return children(...args)
  }

  if (Children.count(children) > 1) {
    return children
  }

  if (!isValidElement(children)) {
    return children
  }

  return cloneElement(children as ReactElement<any>, {
    ...(safeObject(args[0])),
  })
}
