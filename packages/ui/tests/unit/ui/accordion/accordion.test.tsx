import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Accordion', () => {
  describe('Rendering', () => {
    it('should render accordion', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      expect(container.querySelector('[data-orientation]')).toBeInTheDocument()
    })

    it('should render multiple items', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Question 3</AccordionTrigger>
            <AccordionContent>Answer 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const triggers = screen.getAllByRole('button')
      expect(triggers).toHaveLength(3)
    })

    it('should render trigger with correct text', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes.</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      expect(screen.getByText('Is it accessible?')).toBeInTheDocument()
    })

    it('should apply custom className to AccordionItem', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="custom-item">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const item = container.querySelector('.custom-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveClass('border-b')
    })
  })

  describe('Single Type', () => {
    it('should expand item when trigger clicked', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      expect(screen.getByText('Answer')).toBeVisible()
    })

    it('should collapse item when clicked again (collapsible)', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const trigger = screen.getByRole('button')

      await user.click(trigger)
      expect(screen.getByText('Answer')).toBeVisible()

      await user.click(trigger)
      expect(screen.queryByText('Answer')).not.toBeInTheDocument()
    })

    it('should close previous item when opening new one', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const [trigger1, trigger2] = screen.getAllByRole('button')

      await user.click(trigger1)
      expect(screen.getByText('Answer 1')).toBeVisible()

      await user.click(trigger2)
      expect(screen.getByText('Answer 2')).toBeVisible()
      expect(screen.queryByText('Answer 1')).not.toBeInTheDocument()
    })
  })

  describe('Multiple Type', () => {
    it('should allow multiple items to be open', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const [trigger1, trigger2] = screen.getAllByRole('button')

      await user.click(trigger1)
      await user.click(trigger2)

      expect(screen.getByText('Answer 1')).toBeVisible()
      expect(screen.getByText('Answer 2')).toBeVisible()
    })

    it('should toggle items independently', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const [trigger1, trigger2] = screen.getAllByRole('button')

      await user.click(trigger1)
      await user.click(trigger2)

      expect(screen.getByText('Answer 1')).toBeVisible()
      expect(screen.getByText('Answer 2')).toBeVisible()

      await user.click(trigger1)

      expect(screen.queryByText('Answer 1')).not.toBeInTheDocument()
      expect(screen.getByText('Answer 2')).toBeVisible()
    })
  })

  describe('Default Value', () => {
    it('should open item with defaultValue (single)', () => {
      render(
        <Accordion type="single" defaultValue="item-2" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      expect(screen.queryByText('Answer 1')).not.toBeInTheDocument()
      expect(screen.getByText('Answer 2')).toBeVisible()
    })

    it('should open multiple items with defaultValue (multiple)', () => {
      render(
        <Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Question 3</AccordionTrigger>
            <AccordionContent>Answer 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      expect(screen.getByText('Answer 1')).toBeVisible()
      expect(screen.queryByText('Answer 2')).not.toBeInTheDocument()
      expect(screen.getByText('Answer 3')).toBeVisible()
    })
  })

  describe('Disabled State', () => {
    it('should not expand disabled item', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      expect(screen.queryByText('Answer')).not.toBeInTheDocument()
    })

    it('should have disabled attribute on disabled item', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-controls')
    })

    it('should update aria-expanded when opened', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const trigger = screen.getByRole('button')

      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await user.click(trigger)

      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('should have region role on content when expanded', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      const region = screen.getByRole('region')
      expect(region).toBeInTheDocument()
    })
  })
})
