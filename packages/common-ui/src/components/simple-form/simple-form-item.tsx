import type { ReactNode } from 'react'
import type { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'
import {

  useFormContext,

} from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/ui/form'
import { renderChildren } from '~/utils/render-helper'

export interface SimpleFormItemProps<Values extends FieldValues> {
  field: Path<Values>
  label?: string | ReactNode
  description?: string
  children?: ((field:
  ControllerRenderProps<Values, Path<Values>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<Values>) => ReactNode) | ReactNode
}

export function SimpleFormItem<Values extends FieldValues = FieldValues>(props: SimpleFormItemProps<Values>) {
  const formContext = useFormContext<Values>()

  return (
    <FormField
      control={formContext.control}
      name={props.field}
      render={({ field, fieldState, formState }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            {renderChildren(props?.children, field, fieldState, formState)}
          </FormControl>
          <FormDescription>
            {props.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
