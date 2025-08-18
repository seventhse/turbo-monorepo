import type { MaybePromise } from '@vi-space/utils'

export type SchemaMode = 'create' | 'edit' | 'readonly'

export type FieldType
  = | 'string' | 'number' | 'boolean' | 'date'
    | 'array' | 'object'
    | string

export type TypeToValue<T extends FieldType>
  = T extends 'string' ? string
    : T extends 'number' ? number
      : T extends 'boolean' ? boolean
        : T extends 'date' ? Date
          : T extends 'array' ? any[]
            : T extends 'object' ? Record<string, any>
              : unknown

/**
 * Utility type to infer the value type from a field type.
 */
export type InferFieldType<T>
  = T extends string ? 'string'
    : T extends number ? 'number'
      : T extends boolean ? 'boolean'
        : T extends Date ? 'date'
          : T extends Array<any> ? 'array'
            : T extends Record<string, any> ? 'object'
              : FieldType

export type ValidatorFn<Value = unknown, Values = unknown> = (
  value: Value,
  message?: string,
  values?: Values,
  index?: number
) => MaybePromise<boolean>

export type IValidator<Value = unknown, Values = unknown>
  = | {
    type: 'required' | 'email' | 'phone'
    message?: string
    validator?: ValidatorFn<Value, Values>
  }
  | {
    type?: undefined
    message?: string
    validator: ValidatorFn<Value, Values>
  }

/**
 * The basic interface for a form field definition.
 * @template T The field type.
 * @template Values The type for all form values.
 * @template Value The type for the value held by this field.
 */
export interface IBaseField<
  T extends FieldType = FieldType,
  Values = unknown,
  Value = TypeToValue<T>,
> {
  /** The field's key (name) in the form data. */
  key?: string
  /** The type of the field (e.g., 'string', 'number', etc.). */
  type?: T

  /** Field configuration overrides for create mode. */
  create?: Partial<IBaseField<T, Values, Value>>
  /** Field configuration overrides for edit mode. */
  edit?: Partial<IBaseField<T, Values, Value>>
  /** Field configuration overrides for readonly mode. */
  readonly?: Partial<IBaseField<T, Values, Value>>
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
export type ResolveField<
  Value,
  Values,
  FieldBase extends IBaseField<FieldType, any, any>,
> = FieldBase extends IBaseField<infer T, any, any>
  ? IBaseField<T, Values, Value> & Omit<FieldBase, keyof IBaseField<T, Values, Value>>
  : FieldBase

/**
 * Utility type to recursively infer a field definition from a value type.
 */
export type InferField<
  T,
  Values,
  FieldBase extends IBaseField<FieldType, any, any>,
>
  = T extends string ? (ResolveField<T, Values, FieldBase> & { type?: 'string' })
    : T extends number ? (ResolveField<T, Values, FieldBase> & { type?: 'number' })
      : T extends boolean ? (ResolveField<T, Values, FieldBase> & { type?: 'boolean' })
        : T extends Date ? (ResolveField<T, Values, FieldBase> & { type?: 'date' })
          : T extends Array<infer Items>
            ? ArrayField<Items, Values, FieldBase>
            : T extends Record<string, any>
              ? ObjectField<T, Values, FieldBase>
              : ResolveField<T, Values, FieldBase>

/**
 * A form field representing an array of items.
 * @template Items The type of array items.
 * @template Values The type for all form values.
 */
export type ArrayField<
  Items = unknown,
  Values = unknown,
  FieldBase extends IBaseField<FieldType, any, any> = IBaseField<'array', Values, Items>,
> = IBaseField<'array', Values, Items[]>
  & Omit<FieldBase, keyof IBaseField<'array', Values, Items>> & {
    type: 'array'
    /**
     * Child fields representing each item in the array.
     * The children structure is recursively inferred from the array item type,
     * allowing nested schemas for complex array elements.
     */
    children?: Items extends Record<string, any>
      ? { [K in keyof Items]: InferField<Items[K], Values, FieldBase> & { key?: string } }
      : InferField<Items, Values, FieldBase>
  }

/**
 * A form field representing an object with nested properties.
 * @template Props The type of the object properties.
 * @template Values The type for all form values.
 */
export type ObjectField<
  Props = unknown,
  Values = unknown,
  FieldBase extends IBaseField<FieldType, any, any> = IBaseField<'object', Values, Props>,
> = IBaseField<'object', Values, Props>
  & Omit<FieldBase, keyof IBaseField<'object', Values, Props>> & {
    type: 'object'
    /**
     * Child fields representing each property of the object.
     * The children structure is recursively inferred from the object properties,
     * enabling deeply nested form schemas.
     */
    children?: {
      [K in keyof Props]: InferField<Props[K], Values, FieldBase>
    }
  }

export type IField<
  Value = any,
  Values = any,
  FieldBase extends IBaseField<FieldType, any, any> = IBaseField<FieldType, Values, Value>,
>
  = | ResolveField<Value, Values, FieldBase>
    | ArrayField<Value extends Array<infer U> ? U : unknown, Values, FieldBase>
    | ObjectField<Value extends Record<string, any> ? Value : unknown, Values, FieldBase>

/**
 * Utility type to extend a schema definition based on a given set of form values.
 *
 * This type recursively maps each property in the Values record to an appropriate
 * field definition, inferring the correct field type (string, number, boolean, date,
 * array, or object) and preserving the base field configuration from FieldBase.
 *
 * It enables strong type-safe inference of form schemas that precisely mirror
 * the shape and types of the form values, while also supporting UI-oriented
 * field configuration through extension of the base field type.
 *
 * @template FieldBase The base field type used as a starting point for each field.
 * @template Values The record of form values to infer the schema from.
 *
 * @example
 * ```ts
 * type UIFieldExtension<Values extends Record<string, unknown>> = IBaseField<FieldType, Values> & {
 *   control: 'input' | 'select' | string;
 *   props?: Record<string, any>;
 * };
 *
 * type UISchema<Values extends Record<string, unknown>> = ExtendSchemaWith<UIFieldExtension<Values>, Values>;
 *
 * const uISchema: UISchema<{
 *   name: string,
 *   sex: number
 * }> = {
 *   name: {
 *     control: 'input',
 *     label: 'Person Name',
 *   },
 *   sex: {
 *     control: 'select',
 *     label: 'Person Sex',
 *     props: {
 *       options: [
 *         { label: 'unknown', value: -1 },
 *         { label: 'women', value: 0 },
 *         { label: 'men', value: 1 },
 *       ],
 *     },
 *   },
 * };
 * ```
 */
export type ExtendSchemaWith<
  FieldBase extends IBaseField<FieldType, any, any>,
  Values extends Record<string, unknown>,
> = {
  [K in keyof Values]: InferField<Values[K], Values, FieldBase>
}

export type ISchema<Values extends Record<string, unknown> = Record<string, unknown>> = ExtendSchemaWith<IBaseField<FieldType, Values>, Values>
