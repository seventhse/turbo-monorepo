import type { Schema } from '../schema-form'
import { useState } from 'react'
import { Button } from '~/ui/button'
import { SchemaForm } from '../schema-form'

const stepOneSchema: Schema<{
  stepName: string
  next: unknown
}> = {
  stepName: {
    label: 'Name',
    control: 'input',
    required: true,
  },
  next: {
    render() {
      return <Button type="submit">Next Step</Button>
    },
  },
}

const stepTwoSchema: Schema<{
  stepNameTwo: string
  next: unknown
}> = {
  stepNameTwo: {
    label: 'name',
    control: 'select',
    controlProps: {
      options: [
        {
          label: 'demo',
          value: 'demo',
        },
        {
          label: 'demo1',
          value: 'demo1',
        },
      ],
    },
  },
  next: {
    render() {
      return <Button type="submit">Next Step</Button>
    },
  },
}

const stepThreeSchema: Schema<{
  stepNameThree: string
  submit: unknown
}> = {
  stepNameThree: {
    label: 'Name',
    control: 'input',
  },
  submit: {
    render() {
      return <Button type="submit">Submit</Button>
    },
  },
}

enum StepEnum {
  One,
  Two,
  Three,
}

export function StepForm() {
  const [step, setStep] = useState<StepEnum>(StepEnum.One)

  return (
    <div className="w-[600px] mx-auto">
      <div>
        {
          step === StepEnum.One && (
            <SchemaForm
              schema={stepOneSchema}
              onSubmit={(value) => {
                setStep(StepEnum.Two)
              }}
            />
          )
        }
        {
          step === StepEnum.Two && (
            <SchemaForm
              schema={stepTwoSchema}
              onSubmit={((value) => {
                console.log('step 2', value)
                setStep(StepEnum.Three)
              })}
            />
          )
        }
        {
          step === StepEnum.Three && (
            <SchemaForm
              schema={stepThreeSchema}
              onSubmit={(value) => {
                console.log('final submit:', value)
              }}
            />
          )
        }
      </div>
    </div>
  )
}
