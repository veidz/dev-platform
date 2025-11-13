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
  })
})
