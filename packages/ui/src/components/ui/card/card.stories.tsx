import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import { Input } from '../input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input placeholder="Name" />
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">
          Simple card with just content, no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 1</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 2</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 3</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 4</CardTitle>
          <CardDescription>Fourth card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 4</p>
        </CardContent>
      </Card>
    </div>
  ),
}
