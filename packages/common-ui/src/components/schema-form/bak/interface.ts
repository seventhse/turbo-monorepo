export type SchemaMode = 'create' | 'edit' | 'readonly'

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'

export type TypeToValue<T = unknown, Value = any>
  = T extends string ? string
    : T extends number ? number
      : T extends boolean ? boolean
        : T extends Date ? Date
          : T extends any[] ? Value[]
            : T extends Record<string, any> ? Value
              : unknown

export interface IBaseField {
  /** The field's key (name) in the form data. */
  key?: string
  /** The type of the field (e.g., 'string', 'number', etc.). */
  type?: FieldType
}

export type WithMode<T> = T & {
  /** Field configuration overrides for create mode. */
  create?: Partial<T>
  /** Field configuration overrides for edit mode. */
  edit?: Partial<T>
  /** Field configuration overrides for readonly mode. */
  readonly?: Partial<T>
}

export type IArrayField<
  Items = unknown,
  T = any,
> = Exclude<T, 'type'> & {
  type: 'array'
  children?: {
    [k in keyof Items]: IField<T>
  }
}

export type IObjectField<
  Props = unknown,
  T = any,
> = Exclude<T, 'type'> & {
  type: 'object'
  children?: {
    [K in keyof Props]: IField<T>
  }
}

/**
 * Helper to resolve the correct FieldBase with the proper Value type for each field.
 * This type preserves the Value type in validators and other field properties,
 * ensuring type safety and correct inference within nested schemas.
 *
 * @template Value The type of the field's value.
 * @template Values The type for all form values.
 * @template FieldBase The base field type to extend.
 */
export type ResolveField<FieldBase>
  = FieldBase extends IBaseField
    ? WithMode<IBaseField & FieldBase>
    : never

/**
 * Utility type to recursively infer a field definition from a value type.
 */
export type InferField<
  T,
  FieldBase extends IBaseField,
>
  = T extends string ? (ResolveField<FieldBase> & { type?: 'string' })
    : T extends number ? (ResolveField<FieldBase> & { type?: 'number' })
      : T extends boolean ? (ResolveField<FieldBase> & { type?: 'boolean' })
        : T extends Date ? (ResolveField<FieldBase> & { type?: 'date' })
          : T extends Array<infer Items>
            ? WithMode<IArrayField<Items, FieldBase>>
            : T extends Record<string, any>
              ? WithMode<IObjectField<T, FieldBase>>
              : ResolveField<FieldBase>

export type IField<
  Value = any,
  Field extends IBaseField = IBaseField,
>
  = | Field
    | IArrayField<Value extends Array<infer U> ? U : unknown, Field>
    | IObjectField<Value extends Record<string, any> ? Record<string, any> : unknown, Field>

export type IModeField<
  Value = any,
  Field extends IBaseField = IBaseField,
> = WithMode<IField<Value, Field>>

export type IModeSchema<
  Values extends Record<string, any> = Record<string, any>,
  Field extends IBaseField = IBaseField,
> = {
  [K in keyof Values]: InferField<Values[K], Field>
}
