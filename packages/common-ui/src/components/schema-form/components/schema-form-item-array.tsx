import type { TransformedField } from '../common'
import { Plus, X } from 'lucide-react'
import { Button } from '~/ui/button'
import { SimpleFormItem, SimpleFormItemArray } from '../../simple-form'
import { getChildrenInitVal, replaceIndexByFullKey } from '../common'
import { SchemaFormItem } from './schema-form-item'

export interface SchemaFormItemArrayProps<Values extends Record<string, any>> {
  field: TransformedField<Values>
}

export function SchemaFormItemArray<Values extends Record<string, any>>({ field }: SchemaFormItemArrayProps<Values>) {
  const composeChildKey = (key: string | number) => `array-${field.fullKey}-${key}`

  return (
    <SimpleFormItem
      field={field.fullKey}
      label={field.label}
      description={field.description}
      data-level={field.level}
    >
      {Boolean(field?.children?.length) && (
        <SimpleFormItemArray
          field={field.fullKey}
        >
          {({ fields, append, remove }) => {
            return (
              <div className="space-y-3 mt-3">
                <div className="space-y-3">
                  {
                    fields.map((arrayField, fieldIndex) => {
                      return (
                        <div
                          key={arrayField.id}
                          className="grid grid-cols-3 gap-3 p-3 rounded-sm border-border border-[1px]"
                        >
                          {
                            field.children?.map((childField) => {
                              const childFieldKey = replaceIndexByFullKey(childField.fullKey, fieldIndex)
                              return (
                                <SchemaFormItem
                                  key={composeChildKey(`${arrayField.id}-${childFieldKey}`)}
                                  field={{
                                    ...childField,
                                    fullKey: childFieldKey,
                                  }}
                                  index={fieldIndex}
                                />
                              )
                            })
                          }
                          <div className="col-span-3 flex justify-end">
                            <Button
                              variant="destructive"
                              onClick={() => {
                                remove(fieldIndex)
                              }}
                            >
                              <X />
                              {' '}
                              Remove
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                <div>
                  <Button
                    variant="ghost"
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      const defaultValue = getChildrenInitVal(field?.children || [])
                      append(defaultValue)
                    }}
                  >
                    <Plus />
                    {' '}
                    Add
                  </Button>
                </div>
              </div>
            )
          }}
        </SimpleFormItemArray>
      )}
    </SimpleFormItem>
  )
}
