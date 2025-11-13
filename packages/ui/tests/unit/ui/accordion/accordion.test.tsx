import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { render, screen } from '@testing-library/react'

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
  })
})
