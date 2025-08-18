import type {
  ComposedField,
  SchemaArrayField,
  SchemaField,
  SchemaFormMode,
  SchemaObjectField,
} from './interface'

/**
 * Determines whether the given SchemaField is of type 'object'.
 * @param value - Any SchemaField instance.
 * @returns True if the field is of type 'object', otherwise false.
 */
export function isObjectField<
  AllFormValues extends object,
>(value: SchemaField<any, AllFormValues>):
  value is SchemaObjectField<any, AllFormValues> {
  return !!value && 'type' in value && value.type === 'object'
}

/**
 * Determines whether the given SchemaField is of type 'array'.
 * @param value - Any SchemaField instance.
 * @returns True if the field is of type 'array', otherwise false.
 */
export function isArrayField<
  AllFormValues extends object = object,
>(value: SchemaField<any, AllFormValues>): value is SchemaArrayField<any, AllFormValues> {
  return !!value && 'type' in value && value.type === 'array'
}

/**
 * Merges mode-specific overrides into a schema field and returns a composed field without mode-specific overrides.
 * This function is type-specific and avoids using broad generics.
 *
 * @template Value - The type of the field's value.
 * @template AllFormValues - The type representing all form values.
 * @param field - A SchemaField object that may include mode-specific overrides.
 * @param mode - The current form mode ('create', 'edit', or 'readonly').
 * @returns A ComposedField with merged mode-specific configuration and no type assertions.
 *
 * @example
 * const composed = composeFieldByMode(field, 'edit');
 * // Returns a field configuration merged with 'edit' mode-specific overrides.
 */
export function composeFieldByMode<Value, AllFormValues extends object>(
  field: SchemaField<Value, AllFormValues>,
  mode?: SchemaFormMode,
): ComposedField<Value, AllFormValues> {
  const { create, edit, readonly, ...baseField } = field

  switch (mode) {
    case 'create':
      // Safely merge baseField with create-specific overrides.
      return { ...baseField, ...create } as ComposedField<Value, AllFormValues>
    case 'edit':
      // Safely merge baseField with edit-specific overrides.
      return { ...baseField, ...edit } as ComposedField<Value, AllFormValues>
    case 'readonly':
      // Safely merge baseField with readonly-specific overrides.
      return { ...baseField, ...readonly } as ComposedField<Value, AllFormValues>
    default:
      // Return the base field configuration if no mode is specified.
      return baseField
  }
}

export function composeFullKey(key: string, parentKey?: string, type?: 'object' | 'array') {
  if (!parentKey) {
    return key
  }
  if (type === 'array') {
    return `${parentKey}[index].${key}`
  }
  return `${parentKey}.${key}`
}

export function replaceIndexByFullKey(key: string, index: number) {
  if (key.includes('[index]')) {
    return key.replace('[index]', `[${index}]`)
  }
  return key
}
