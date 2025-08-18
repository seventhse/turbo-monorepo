import type { BaseOptionItem } from '@vi-space/utils'
import { isPlainObject } from '@vi-space/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/ui/select'

export interface SimpleSelectProps {
  options?: BaseOptionItem[] | Array<string | number | boolean>
}

function safeOption(options: SimpleSelectProps['options']) {
  if (!options?.length) {
    return []
  }
  return options?.map((item) => {
    if (isPlainObject(item)) {
      return item
    }
    return {
      label: item,
      value: item.toString(),
    }
  })
}

export function SimpleSelect({ options }: SimpleSelectProps) {
  if (!options?.length) {
    return null
  }
  const safeOptions = safeOption(options)
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Theme"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        {safeOptions.map(item => (
          <SelectItem key={item.value!} value={item.value}>{item.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
