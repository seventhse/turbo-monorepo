import type { ReactNode } from 'react'
import type { FieldArrayPath, FieldValues, UseFieldArrayProps, UseFieldArrayReturn } from 'react-hook-form'
import {

  useFieldArray,

  useFormContext,
} from 'react-hook-form'
import { renderChildren } from '~/utils/render-helper'

export interface SimpleFormItemArrayProps<
  Values extends FieldValues,
  TFieldArrayName extends FieldArrayPath<Values>,
> extends Omit<UseFieldArrayProps<Values, TFieldArrayName>, 'control' | 'name'> {
  field: TFieldArrayName
  children?: ((fieldArrayState: UseFieldArrayReturn<Values>) => ReactNode)
}

export function SimpleFormItemArray<
  Values extends FieldValues,
  TFieldArrayName extends FieldArrayPath<Values>,
>(props: SimpleFormItemArrayProps<Values, TFieldArrayName>) {
  const { field, children, ...restProps } = props
  const formContext = useFormContext<Values>()
  const fieldArrayContext = useFieldArray<Values, TFieldArrayName>({
    control: formContext.control,
    name: field,
    ...restProps,
  })

  return renderChildren(children, fieldArrayContext)
}
