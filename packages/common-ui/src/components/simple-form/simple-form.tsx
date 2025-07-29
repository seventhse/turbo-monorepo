import type { PropsWithChildren } from 'react'
import type { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormProps } from 'react-hook-form'
import { noop } from '@vi-space/utils'
import { useForm } from 'react-hook-form'
import { Form } from '~/ui/form'

export interface SimpleFormProps<Values extends FieldValues> extends UseFormProps<Values> {
  onSubmit?: SubmitHandler<Values>
  onError?: SubmitErrorHandler<Values>
  wrapperClass?: string
}

export function SimpleForm<Values extends Record<string, any>>({
  onSubmit = noop,
  onError,
  wrapperClass,
  children,
  ...restProps
}: PropsWithChildren<SimpleFormProps<Values>> = {}) {
  const form = useForm<Values>({
    ...restProps,
  })

  const internalSubmit = form.handleSubmit(onSubmit, onError)

  return (
    <Form {...form}>
      <form
        className={wrapperClass}
        onSubmit={internalSubmit}
      >
        {children}
      </form>
    </Form>
  )
}
