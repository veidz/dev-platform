import type { Meta } from '@storybook/react-vite'
import { addDays } from 'date-fns'
import type React from 'react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './calendar'

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta

export const Default = (): React.JSX.Element => {
  return <Calendar mode="single" />
}

export const WithSelected = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return <Calendar mode="single" selected={date} onSelect={setDate} />
}

export const Range = (): React.JSX.Element => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return <Calendar mode="range" selected={range} onSelect={setRange} />
}

export const Multiple = (): React.JSX.Element => {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
  ])

  return <Calendar mode="multiple" selected={dates} onSelect={setDates} />
}

export const Disabled = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={[{ dayOfWeek: [0, 6] }, { before: new Date() }]}
    />
  )
}

export const MinMax = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={[{ before: new Date() }, { after: addDays(new Date(), 30) }]}
    />
  )
}

export const WithFooter = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-4">
      <Calendar mode="single" selected={date} onSelect={setDate} />
      <div className="rounded-md border p-3 text-center text-sm">
        {date ? date.toLocaleDateString() : 'No date selected'}
      </div>
    </div>
  )
}

export const CustomStyling = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-lg"
    />
  )
}

export const Months = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      numberOfMonths={2}
    />
  )
}

export const Years = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown-months"
      fromYear={2020}
      toYear={2030}
    />
  )
}
