import type { IBaseField, IField, IModeField, SchemaMode } from './interface'

function mergedFieldByMode<TField extends IBaseField = IBaseField>(
  mode: SchemaMode,
  field: IModeField<any, TField>,
): IField<any, TField> {
  const {
    create = {},
    edit = {},
    readonly = {},
    ...baseFieldMeta
  } = field

  const fieldMeta = baseFieldMeta as IField<any, TField>

  switch (mode) {
    case 'create':
      return {
        ...fieldMeta,
        ...create,
      }
    case 'edit':
      return {
        ...fieldMeta,
        ...edit,
      }
    case 'readonly':
      return {
        ...fieldMeta,
        ...readonly,
      }
    default:
      return fieldMeta
  }
}

export class Field<TField extends IBaseField = IBaseField> {
  #mode: SchemaMode
  #field: IModeField<any, TField>
  #mergedField: IField<any, TField>

  constructor(mode: SchemaMode, field: IModeField<any, TField>) {
    this.#mode = mode
    this.#field = field
    this.#mergedField = mergedFieldByMode<TField>(mode, field)
  }

  get mode(): SchemaMode {
    return this.#mode
  }

  set mode(val: SchemaMode) {
    this.#mergedField = mergedFieldByMode<TField>(val, this.#field)
    this.#mode = val
  }

  get field(): IField<any, TField> {
    return this.#mergedField
  }
}

export function createField<
  Field extends IBaseField = IBaseField,
>(field: IModeField<any, Field>, mode: SchemaMode = 'create') {
  return new Field(mode, field)
}
