import type { PropsWithChildren } from 'react'
import type { DefaultValues } from 'react-hook-form'
import type { SimpleFormProps } from '../../simple-form'
import type { Schema, SchemaFormMode } from '../common'
import { cn } from '@vi-space/utils'
import { SimpleForm } from '../../simple-form'
import { getSchemaInitVal, transformSchema } from '../common'
import { SchemaFormProvider } from '../context'
import { SchemaFormItem } from './schema-form-item'

/**
 * Props for the SchemaForm component.
 * @template Values - The type representing the form values.
 */
export interface SchemaFormProps<Values extends Record<string, any>> extends SimpleFormProps<Values> {
  /** The schema definition for the form. */
  schema: Schema<Values>
  /** The mode of the form, e.g., 'create', 'edit', or 'readonly'. */
  schemaMode?: SchemaFormMode
  wrapperClass?: string
}

/**
 * SchemaForm component for rendering forms based on a schema definition.
 * @template Values - The type representing the form values.
 */
export function SchemaForm<
  Values extends Record<string, any>,
>(
  props: PropsWithChildren<SchemaFormProps<Values>>,
) {
  const {
    schema,
    schemaMode,
    ...restProps
  } = props

  const fields = transformSchema(schema, schemaMode)
  const defaultValues = getSchemaInitVal<Values>(schema) as DefaultValues<Values>

  return (
    <SchemaFormProvider schemaMode={schemaMode}>
      <SimpleForm
        defaultValues={defaultValues}
        wrapperClass={cn('space-y-3', restProps.wrapperClass)}
        {...restProps}
      >
        {
          fields.map(field => (
            <SchemaFormItem<Values>
              key={`schema-form-item-${field.key}`}
              field={field}
            />
          ))
        }
      </SimpleForm>
    </SchemaFormProvider>
  )
}
