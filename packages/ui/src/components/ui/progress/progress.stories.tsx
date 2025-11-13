import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'

import { Progress } from './progress'

const meta = {
  component: Progress,
  tags: ['autodocs'],
  title: 'UI/Progress',
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Progress value={33} />,
}

export const WithValue: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">0%</div>
        <Progress value={0} />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">25%</div>
        <Progress value={25} />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">50%</div>
        <Progress value={50} />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">75%</div>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">100%</div>
        <Progress value={100} />
      </div>
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => <Progress value={null} />,
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Extra Small (h-1)</div>
        <Progress value={60} className="h-1" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Small (h-2 - default)</div>
        <Progress value={60} />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Medium (h-3)</div>
        <Progress value={60} className="h-3" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Large (h-4)</div>
        <Progress value={60} className="h-4" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Extra Large (h-6)</div>
        <Progress value={60} className="h-6" />
      </div>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Primary (default)</div>
        <Progress value={65} />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Success (green)</div>
        <Progress value={65} className="[&>div]:bg-green-500 bg-green-500/20" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Warning (yellow)</div>
        <Progress
          value={65}
          className="[&>div]:bg-yellow-500 bg-yellow-500/20"
        />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Danger (red)</div>
        <Progress value={65} className="[&>div]:bg-red-500 bg-red-500/20" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Info (blue)</div>
        <Progress value={65} className="[&>div]:bg-blue-500 bg-blue-500/20" />
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Uploading file...</span>
          <span className="text-sm text-muted-foreground">45%</span>
        </div>
        <Progress value={45} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Processing data...</span>
          <span className="text-sm text-muted-foreground">78%</span>
        </div>
        <Progress value={78} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Download complete</span>
          <span className="text-sm text-muted-foreground">100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
}

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + 10
        })
      }, 500)

      return (): void => clearInterval(timer)
    }, [])

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Loading...</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    )
  },
}

export const Complete: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Upload complete!</span>
        <span className="text-sm text-green-600">100%</span>
      </div>
      <Progress value={100} className="[&>div]:bg-green-500" />
    </div>
  ),
}

export const MultipleSteps: Story = {
  render: () => {
    const [step, setStep] = useState(1)
    const totalSteps = 5
    const progress = (step / totalSteps) * 100

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setStep(Math.min(totalSteps, step + 1))}
            disabled={step === totalSteps}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setStep(1)}
            className="rounded bg-secondary px-4 py-2 text-sm text-secondary-foreground"
          >
            Reset
          </button>
        </div>
      </div>
    )
  },
}

export const DifferentWidths: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Small width (w-1/4)</div>
        <Progress value={75} className="w-1/4" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Medium width (w-1/2)</div>
        <Progress value={75} className="w-1/2" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Large width (w-3/4)</div>
        <Progress value={75} className="w-3/4" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Full width (default)</div>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Fixed width (w-64)</div>
        <Progress value={75} className="w-64" />
      </div>
    </div>
  ),
}
