import type { Field } from './field'
import type { IArrayField, IBaseField, IModeSchema, IObjectField, SchemaMode } from './interface'
import { isEmptyObject } from '@vi-space/utils'
import { createField } from './field'
import { isArrayField, isObjectField } from './utils'

export interface SchemaOptions {
  mode?: SchemaMode
}

function createFieldMap<
  Values extends Record<string, any> = Record<string, any>,
  T extends IBaseField = IBaseField,
>(schema: IModeSchema<Values, T>) {
  const map: Map<string, Field> = new Map()

  function traverse<Values extends Record<string, any>>(schema: IModeSchema<Values, T>, prefix?: string) {
    Object.entries(schema).forEach(([key, field]) => {
      if (['object', 'array'].includes(field.type)) {
        traverse(field.children, key)
        return
      }

      map.set(prefix ? `${prefix}.${key}` : key, createField(field))
    })
  }

  traverse(schema)
  return map
}

export class Schema<
  Values extends Record<string, any>,
  TField extends IBaseField = IBaseField,
> {
  #schema: IModeSchema<Values, TField>
  #mode: SchemaMode
  #fieldMap: Map<string, Field> = new Map()
  #modeSchema: IModeSchema<Values, TField>

  constructor(schema: IModeSchema<Values, TField>, options?: SchemaOptions) {
    const { mode = 'create' } = options || {}
    this.#schema = schema
    this.#mode = mode
    this.#fieldMap = createFieldMap(schema)
    this.#modeSchema = this.buildModeSchema()
  }

  private buildModeSchema() {
    const fieldMap = this.#fieldMap

    const build = (schema: IModeSchema<Values, TField> | IArrayField<any, TField> | IObjectField<any, TField>, prefix?: string): any => {
      return Object.entries(schema).reduce((acc: IModeSchema<any>, [key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key
        const fieldInstance = fieldMap.get(path)

        if (!fieldInstance) {
          acc[key] = value
          return acc
        }

        const newField = fieldInstance.field

        if (isObjectField(newField) && isObjectField(value) && !isEmptyObject(value.children)) {
          newField.children = build((value as IObjectField).children, path)
        }

        if (isArrayField(newField) && isArrayField(value) && !isEmptyObject(value.children)) {
          newField.children = build((value as IArrayField).children, path)
        }

        acc[key] = newField

        return acc
      }, {})
    }

    return build(this.originSchema) as IModeSchema<Values, TField>
  }

  get mode(): SchemaMode {
    return this.#mode
  }

  set mode(val: SchemaMode) {
    for (const field of this.#fieldMap.values()) {
      field.mode = val
    }
    this.#mode = val
    this.#modeSchema = this.buildModeSchema()
  }

  get originSchema(): IModeSchema<Values, TField> {
    return this.#schema
  }

  get schema(): IModeSchema<Values, TField> {
    return this.#modeSchema
  }
}

/**
 * Creates a schema definition for form validation and structure, with automatic type inference for validator functions.
 *
 * This utility helps define a form schema in a type-safe manner. The generic parameter `Values` describes the shape of the form data.
 * The validators within the schema will automatically infer the type of their input value based on the corresponding property in `Values`.
 *
 * @template Values - The type describing the structure of the form values.
 * @param {Schema<Values>} schema - The schema definition object.
 * @returns {Schema<Values>} The schema object, unchanged, but with full type safety and inference for validator functions.
 */
export function createSchema<
  Values extends Record<string, any>,
>(schema: IModeSchema<Values>, options?: SchemaOptions) {
  return new Schema(schema, options)
}
