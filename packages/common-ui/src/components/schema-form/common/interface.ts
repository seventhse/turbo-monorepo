import type { ReactNode } from 'react'
import type { SchemaFormControl, SchemaFormControlPropsMap } from './constant'

/**
 * Defines the rendering mode for the form.
 */
export type SchemaFormMode = 'create' | 'edit' | 'readonly'

/**
 * A higher-order type that adds mode-specific overrides to a base field configuration.
 * @template T - The base field configuration type.
 */
export type WithModeOverrides<T> = T & {
  /** Specific configuration for 'create' mode. */
  create?: Partial<T>
  /** Specific configuration for 'edit' mode. */
  edit?: Partial<T>
  /** Specific configuration for 'readonly' mode. */
  readonly?: Partial<T>
}

/**
 * A discriminated union type based on the 'control' property.
 * Ensures that the type of 'controlProps' strictly corresponds to the value of 'control'.
 */
type DiscriminatedControl = {
  [K in SchemaFormControl]: {
    control: K // The 'control' property is required to form a valid discriminated union.
    controlProps?: SchemaFormControlPropsMap[K]
  }
}[SchemaFormControl] | {
  // Allows cases where 'control' is not defined.
  control?: never
  controlProps?: never
}

/**
 * Base interface for all field types, defining common properties.
 * @template Value - The type of the field's value.
 * @template AllFormValues - The type representing the complete data structure of the form.
 */
export interface IBaseField<Value, AllFormValues extends object> {
  type?: 'array' | 'object'
  label?: string
  description?: string
  /** The initial value of the field. */
  initValue?: Value
  /**
   * Custom rendering logic for the field.
   * @param field - The transformed field configuration (includes key and other information).
   * @param index - The index of the field if it is part of an array.
   * @returns A React node for rendering.
   */
  render?: (field: TransformedField<AllFormValues>, index?: number) => ReactNode
  /**
   * Determines whether the field should be displayed based on a condition.
   * @param value - The current value of the field.
   * @param values - The current values of the entire form.
   * @returns True if the field should be displayed, otherwise false.
   */
  show?: (value: Value, values: AllFormValues) => boolean
  required?: boolean
}

/**
 * Represents a field of type 'object'.
 * @template Shape - The structure type of the object field itself.
 * @template AllFormValues - The type representing the complete data structure of the form.
 */
export type SchemaObjectField<Shape extends object, AllFormValues extends object>
  = IBaseField<Shape, AllFormValues> & {
    type: 'object'
    /** Nested object structure definition. */
    children: SchemaDefinition<Shape, AllFormValues>
  }

/**
 * Represents a field of type 'array', where each item is an object.
 * @template ItemShape - The structure type of each object in the array.
 * @template AllFormValues - The type representing the complete data structure of the form.
 */
export type SchemaArrayField<ItemShape extends object, AllFormValues extends object>
  = IBaseField<ItemShape[], AllFormValues> & {
    type: 'array'
    /** Structure definition for each object in the array. */
    children: SchemaDefinition<ItemShape, AllFormValues>
  }

/**
 * Conditional type that automatically infers and selects the most appropriate field type based on the type of `Value`.
 * This is the core of the type system, enabling automatic type distribution.
 * @template Value - The type of the field's value.
 * @template AllFormValues - The type representing the complete data structure of the form.
 */
export type SchemaField<Value, AllFormValues extends object>
  = WithModeOverrides<
    (IBaseField<Value, AllFormValues> & DiscriminatedControl)
    | (
      Value extends (infer Item)[]
        ? Item extends object
          ? SchemaArrayField<Item, AllFormValues>
          : never // Nested structures for non-object arrays are not supported.
        : Value extends object
          ? SchemaObjectField<Value, AllFormValues>
          : never // Already a base field, no further matching needed.
    )
  >

/**
 * Defines the schema for an object structure, mapping an object type to its field definitions.
 * @template Shape - The structure of the object being defined.
 * @template AllFormValues - The type representing the complete data structure of the form.
 */
export type SchemaDefinition<Shape extends object, AllFormValues extends object = Shape> = {
  /** Ensures immutability of the schema using readonly. */
  readonly [K in keyof Shape]: SchemaField<Shape[K], AllFormValues>;
}

/**
 * Alias for the top-level schema definition, making it easier to use.
 * @template Values - The type representing the complete data structure of the form.
 */
export type Schema<Values extends object> = SchemaDefinition<Values, Values>

/**
 * Represents a field after mode-specific overrides have been applied but before transformation.
 * This is the "base" version of the SchemaField type, excluding WithModeOverrides.
 * @template Value - The type of the field's value.
 * @template AllFormValues - The type representing the complete data structure of the form.
 */
export type ComposedField<Value, AllFormValues extends object>
  = | (IBaseField<Value, AllFormValues> & DiscriminatedControl)
    | (Value extends (infer Item)[]
      ? Item extends object
        ? SchemaArrayField<Item, AllFormValues>
        : never
      : Value extends object
        ? SchemaObjectField<Value, AllFormValues>
        : never)

/**
 * Represents a transformed, flattened, unified field type.
 * At runtime, the original nested schema is processed into an array of this type for rendering and logic handling.
 * @template AllFormValues - The type representing the complete data structure of the form.
 */
export type TransformedField<AllFormValues extends object> = WithModeOverrides<
  IBaseField<any, AllFormValues> & DiscriminatedControl & {
    /** Unique identifier for the field, typically its path in the form value object, e.g., 'user.name'. */
    key: string
    fullKey: string
    level: number
    /** The type of the field, used to distinguish object, array, and base fields. */
    type?: 'object' | 'array'
    /**
     * If the field is an object or array, this contains the transformed definitions of its child fields.
     * Enables recursive rendering.
     */
    children?: TransformedField<AllFormValues>[]
  }
>
