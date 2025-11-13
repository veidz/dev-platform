import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { render } from '@testing-library/react'

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
  })
})
