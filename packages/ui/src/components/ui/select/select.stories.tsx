import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="apple">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>
          Banana (Out of stock)
        </SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="mx">Mexico</SelectItem>
        <SelectItem value="br">Brazil</SelectItem>
        <SelectItem value="ar">Argentina</SelectItem>
        <SelectItem value="jp">Japan</SelectItem>
        <SelectItem value="cn">China</SelectItem>
        <SelectItem value="in">India</SelectItem>
        <SelectItem value="kr">South Korea</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithFormLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="language-select" className="text-sm font-medium">
        Programming Language
      </label>
      <Select>
        <SelectTrigger id="language-select" className="w-[280px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="js">JavaScript</SelectItem>
          <SelectItem value="ts">TypeScript</SelectItem>
          <SelectItem value="py">Python</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="go">Go</SelectItem>
          <SelectItem value="rust">Rust</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const InForm: Story = {
  render: () => (
    <form className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Enter your name"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <Select>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="department" className="text-sm font-medium">
          Department
        </label>
        <Select>
          <SelectTrigger id="department">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Engineering</SelectLabel>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Design</SelectLabel>
              <SelectItem value="ux">UX Design</SelectItem>
              <SelectItem value="ui">UI Design</SelectItem>
              <SelectItem value="product">Product Design</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </form>
  ),
}
