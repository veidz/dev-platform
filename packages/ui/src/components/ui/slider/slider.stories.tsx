import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Slider } from './slider'

const meta = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Slider orientation',
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
}

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-4">
      <Slider {...args} />
      <p className="text-sm text-muted-foreground">
        Range slider with two thumbs
      </p>
    </div>
  ),
}

export const WithSteps: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 10,
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-4">
      <Slider {...args} />
      <p className="text-sm text-muted-foreground">Step increments of 10</p>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState([50])
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Volume</label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
      </div>
    )
  },
}

export const Vertical: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-64 items-center justify-center">
      <Slider {...args} />
    </div>
  ),
}

export const PriceRange: Story = {
  render: () => {
    const [priceRange, setPriceRange] = useState([0, 1000])
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Price Range</label>
          <span className="text-sm text-muted-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000}
          step={50}
        />
      </div>
    )
  },
}

export const VolumeControl: Story = {
  render: () => {
    const [volume, setVolume] = useState([70])
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Volume</label>
          <span className="text-sm text-muted-foreground">{volume[0]}%</span>
        </div>
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mute</span>
          <span>Max</span>
        </div>
      </div>
    )
  },
}

export const Temperature: Story = {
  render: () => {
    const [temperature, setTemperature] = useState([20])
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Temperature</label>
          <span className="text-sm text-muted-foreground">
            {temperature[0]}°C
          </span>
        </div>
        <Slider
          value={temperature}
          onValueChange={setTemperature}
          min={10}
          max={30}
          step={0.5}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10°C</span>
          <span>30°C</span>
        </div>
      </div>
    )
  },
}

export const InForm: Story = {
  render: () => {
    const [brightness, setBrightness] = useState([75])
    return (
      <form
        className="w-full max-w-md space-y-6 rounded-lg border p-6"
        onSubmit={(e) => {
          e.preventDefault()
          alert(`Brightness set to ${brightness[0]}%`)
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="brightness-slider" className="text-sm font-medium">
              Brightness
            </label>
            <span className="text-sm text-muted-foreground">
              {brightness[0]}%
            </span>
          </div>
          <Slider
            id="brightness-slider"
            value={brightness}
            onValueChange={setBrightness}
            max={100}
            step={1}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Apply Settings
        </button>
      </form>
    )
  },
}
