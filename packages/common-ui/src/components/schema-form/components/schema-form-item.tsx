import type { FC } from 'react'
import type { TransformedField } from '../common'
import { isFunction } from '@vi-space/utils'
import { useFormContext } from 'react-hook-form'
import { SimpleFormItem } from '../../simple-form'
import { isArrayField, isObjectField, SCHEMA_FORM_CONTROL_MAP } from '../common'
import { SchemaFormItemArray } from './schema-form-item-array'

export interface SchemaFormItemProps<
  Values extends Record<string, any>,
> {
  field: TransformedField<Values>
  index?: number
}

export function SchemaFormItem<
  Values extends Record<string, any>,
>(
  {
    field,
    index,
  }:
  SchemaFormItemProps<Values>,
) {
  const formContext = useFormContext()
  const value = formContext.watch(field.fullKey)
  const values = formContext.getValues()

  if (field.show && !field.show(value, values as Values)) {
    return null
  }

  if (field?.render && isFunction(field.render)) {
    return field.render(field, index)
  }

  if (isObjectField(field)) {
    return (
      <SimpleFormItem
        field={field.fullKey}
        label={field.label}
        description={field.description}
        data-level={field.level}
      >
        <div data-level={field.level} className="ml-3">
          {
            field?.children?.map((childField) => {
              return (
                <SchemaFormItem
                  key={childField.fullKey}
                  field={childField}
                />
              )
            })
          }
        </div>
      </SimpleFormItem>
    )
  }

  if (isArrayField(field)) {
    return <SchemaFormItemArray field={field} />
  }

  if (field.control) {
    const Com = SCHEMA_FORM_CONTROL_MAP[field.control] as FC<any>
    return (
      <SimpleFormItem
        key={`${index}.${field.fullKey}`}
        field={field.fullKey}
        label={field?.label}
        description={field?.description}
        data-level={field.level}
      >
        <Com {...(field?.controlProps ?? {})} />
      </SimpleFormItem>
    )
  }

  return null
}
