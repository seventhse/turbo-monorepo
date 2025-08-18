import type { IArrayField, IBaseField, IField, IObjectField } from './interface'

export function isObjectField<BaseFiled extends IBaseField>(field: IField): field is IObjectField<any, BaseFiled> {
  return field.type === 'object'
}

export function isArrayField<BaseFiled extends IBaseField>(field: IField): field is IArrayField<any, BaseFiled> {
  return field?.type === 'array'
}
