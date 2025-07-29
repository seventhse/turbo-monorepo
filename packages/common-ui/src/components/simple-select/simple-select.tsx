import type { BaseOptionItem } from '@vi-space/utils'
import { Input } from '~/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/ui/select'

export interface SimpleSelectProps {
  options?: BaseOptionItem[] | Array<string | number | boolean>
}

export function SimpleSelect({ options }: SimpleSelectProps) {
  if (!options?.length) {
    return null
  }
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Theme" asChild>
          <Input />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">1</SelectItem>
      </SelectContent>
    </Select>
  )
}
