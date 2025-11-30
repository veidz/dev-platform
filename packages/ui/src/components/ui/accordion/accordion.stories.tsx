import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'

const meta = {
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'UI/Accordion',
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components
          aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It is animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is a single accordion?</AccordionTrigger>
        <AccordionContent>
          A single accordion allows only one item to be open at a time. When you
          open a new item, the previously open item closes automatically.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does collapsible work?</AccordionTrigger>
        <AccordionContent>
          With collapsible enabled, you can close the currently open item by
          clicking on it again. Without it, at least one item must remain open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I customize styles?</AccordionTrigger>
        <AccordionContent>
          Yes! You can customize the accordion using className props or by
          modifying the component styles directly.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Multiple items open</AccordionTrigger>
        <AccordionContent>
          With type="multiple", you can have multiple accordion items open at
          the same time.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Independent toggling</AccordionTrigger>
        <AccordionContent>
          Each item can be toggled independently without affecting other items.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Great for FAQs</AccordionTrigger>
        <AccordionContent>
          This mode is perfect for FAQ sections where users might want to
          compare multiple answers.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-2" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>First item</AccordionTrigger>
        <AccordionContent>This is the first item content.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second item (default open)</AccordionTrigger>
        <AccordionContent>
          This item is open by default because of defaultValue="item-2".
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third item</AccordionTrigger>
        <AccordionContent>This is the third item content.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const WithRichContent: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Profile Information</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Name:</strong> John Doe
            </p>
            <p className="text-sm">
              <strong>Email:</strong> john@example.com
            </p>
            <p className="text-sm">
              <strong>Role:</strong> Developer
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Settings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" defaultChecked />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" />
              <span>SMS notifications</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" defaultChecked />
              <span>Push notifications</span>
            </label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[600px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>How do I create an account?</AccordionTrigger>
        <AccordionContent>
          Click the "Sign Up" button in the top right corner. Fill in your
          email, create a password, and verify your email address. You'll be
          ready to start using the platform immediately.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          We accept all major credit cards (Visa, MasterCard, American Express),
          PayPal, and bank transfers for enterprise accounts. All payments are
          processed securely through our payment partners.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Can I cancel my subscription anytime?
        </AccordionTrigger>
        <AccordionContent>
          Yes, you can cancel your subscription at any time from your account
          settings. Your access will continue until the end of your current
          billing period, and you won't be charged again.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
        <AccordionContent>
          We offer a 30-day money-back guarantee. If you're not satisfied with
          our service, contact our support team within 30 days of your purchase
          for a full refund.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Active item</AccordionTrigger>
        <AccordionContent>
          This item is active and can be toggled.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>
          This content won't be visible because the item is disabled.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another active item</AccordionTrigger>
        <AccordionContent>This item is also active.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const CustomStyling: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1" className="border-blue-200">
        <AccordionTrigger className="text-blue-600 hover:text-blue-700">
          Custom colored item
        </AccordionTrigger>
        <AccordionContent className="text-blue-900">
          This accordion item has custom colors applied.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-green-200">
        <AccordionTrigger className="text-green-600 hover:text-green-700">
          Another custom item
        </AccordionTrigger>
        <AccordionContent className="text-green-900">
          You can customize each item individually.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border-purple-200">
        <AccordionTrigger className="text-purple-600 hover:text-purple-700">
          Third custom item
        </AccordionTrigger>
        <AccordionContent className="text-purple-900">
          Complete control over styling.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const NoBorder: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger>No border item</AccordionTrigger>
        <AccordionContent>
          This accordion has no borders between items.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-none">
        <AccordionTrigger>Clean design</AccordionTrigger>
        <AccordionContent>Perfect for a minimalist interface.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border-none">
        <AccordionTrigger>Simple and elegant</AccordionTrigger>
        <AccordionContent>Remove borders for a cleaner look.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="w-[500px] rounded-lg border p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Product Details</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Specifications</AccordionTrigger>
          <AccordionContent>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Weight: 500g</li>
              <li>Dimensions: 20cm × 15cm × 5cm</li>
              <li>Material: Premium aluminum</li>
              <li>Color: Space Gray</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Shipping & Returns</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              Free shipping on orders over $50. 30-day return policy. Items must
              be in original packaging and unused.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Warranty</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              1-year manufacturer warranty included. Extended warranty available
              for purchase. Covers manufacturing defects and hardware issues.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}
