import type { PropsWithChildren } from 'react'
import type { SchemaFormMode } from './common'
import { createContext, use } from 'react'

export interface SchemaFormContextState {
  schemaMode?: SchemaFormMode
}

// eslint-disable-next-line react-refresh/only-export-components
export const SchemaFormContext = createContext<SchemaFormContextState | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useSchemaFormContext() {
  const context = use(SchemaFormContext)

  if (!context) {
    throw new Error('[useSchemaFormContext] Hook must be used within a <SchemaFormProvider>.')
  }

  return context
}

export function SchemaFormProvider({ children, ...restProps }: PropsWithChildren<SchemaFormContextState>) {
  return (
    <SchemaFormContext value={restProps}>
      {children}
    </SchemaFormContext>
  )
}
