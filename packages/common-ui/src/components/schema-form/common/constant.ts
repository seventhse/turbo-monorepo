import type { ComponentProps } from 'react'
import { SimpleSelect } from '~/components/simple-select/simple-select'
import { Input } from '~/ui/input'

export const SCHEMA_FORM_CONTROL_MAP = {
  input: Input,
  select: SimpleSelect,
} as const

export type SchemaFormControl = keyof typeof SCHEMA_FORM_CONTROL_MAP

export interface SchemaFormControlPropsMap {
  input: ComponentProps<typeof Input>
  select: ComponentProps<typeof SimpleSelect>
}
