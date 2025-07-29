import type { SchemaDefinition, SchemaFormMode, TransformedField } from './interface'
import { composeFieldByMode, composeFullKey, isArrayField, isObjectField } from './utils'

/**
 * Recursively transforms a declarative SchemaDefinition object into an array of TransformedField objects
 * that are easier to render. This is the core converter connecting schema definitions to UI rendering.
 *
 * @template AllFormValues - The type representing the complete data structure of the form.
 * @param schema - The SchemaDefinition object to transform.
 * @param mode - The current form mode, used to apply mode-specific overrides during transformation.
 * @param parentKey - (Internal use) The key path for nested fields, e.g., 'user.address'. Defaults to an empty string.
 * @returns An array of TransformedField objects.
 */
export function transformSchema<AllFormValues extends object>(
  schema: SchemaDefinition<any, AllFormValues>,
  mode?: SchemaFormMode,
  parentKey: string = '',
  parentType?: 'object' | 'array',
): TransformedField<AllFormValues>[] {
  // Iterate over the schema object using Object.entries (key -> field definition).
  return Object.entries(schema).map(([key, fieldDefinition]) => {
    // 1. Apply mode-specific overrides to the field based on the current mode.
    const composedField = composeFieldByMode(fieldDefinition, mode)

    // 2. Construct the full key path. For top-level fields, it's 'name'; for nested fields, it's 'user.name'.
    const fullKey = composeFullKey(key, parentKey, parentType)

    // 3. Separate children (safe destructuring).
    // Check for children before destructuring to satisfy TypeScript.
    const hasChildren = isObjectField(composedField) || isArrayField(composedField)
    const { children, ...restField } = hasChildren ? composedField : { ...composedField, children: undefined }

    // Create the transformed field object.
    const transformedField: TransformedField<AllFormValues> = {
      ...restField,
      key,
      level: parentKey ? fullKey.split('.').length : 1,
      fullKey,
    }

    // If the field has children, recursively transform them.
    if (hasChildren && children) {
      transformedField.children = transformSchema(
        children,
        mode,
        fullKey,
        transformedField.type,
      )
    }

    return transformedField
  })
}

/**
 * Recursively extracts the initial values from a SchemaDefinition object.
 * This function traverses the schema and collects the `initValue` for each field,
 * constructing a complete object representing the initial form values.
 *
 * @template AllFormValues - The type representing the complete data structure of the form.
 * @param schema - The SchemaDefinition object to extract initial values from.
 * @returns An object containing the initial values for all fields in the schema.
 *
 * @example
 * const schema = {
 *   user: {
 *     type: 'object',
 *     children: {
 *       name: { initValue: 'John' },
 *       age: { initValue: 30 }
 *     }
 *   }
 * };
 * const initialValues = getSchemaInitVal(schema);
 * // Returns: { user: { name: 'John', age: 30 } }
 */
export function getSchemaInitVal<AllFormValues extends object>(schema: SchemaDefinition<any, AllFormValues>): AllFormValues {
  return Object.entries(schema).reduce<Record<string, any>>((pre, [key, field]) => {
    // If the field is an object, recursively extract initial values from its children.
    if (isObjectField(field)) {
      pre[key] = getSchemaInitVal(field.children)
    }
    // If the field is an array, recursively extract initial values from its children.
    else if (isArrayField(field)) {
      pre[key] = getSchemaInitVal(field.children)
    }
    // Otherwise, use the field's `initValue` or default to undefined.
    else {
      pre[key] = field?.initValue || undefined
    }

    return pre
  }, {}) as AllFormValues
}

export function getChildrenInitVal<T extends Record<string, any> = Record<string, any>>(
  fields: TransformedField<any>[],
): T {
  return fields.reduce<Record<string, any>>((pre, field) => {
    if (isObjectField(field)) {
      pre[field.key] = getChildrenInitVal(field.children)
    }
    else if (isArrayField(field)) {
      pre[field.key] = [getChildrenInitVal(field.children)]
    }
    else {
      pre[field.key] = field?.initValue || undefined
    }
    return pre
  }, {}) as T
}
