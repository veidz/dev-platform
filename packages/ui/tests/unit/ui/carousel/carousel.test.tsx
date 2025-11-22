import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel/carousel'
import { render, screen } from '@testing-library/react'

describe('Carousel', () => {
  describe('Rendering', () => {
    it('should render carousel with items', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      expect(screen.getByText('Slide 1')).toBeInTheDocument()
      expect(screen.getByText('Slide 2')).toBeInTheDocument()
      expect(screen.getByText('Slide 3')).toBeInTheDocument()
    })

    it('should render with navigation buttons', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      expect(
        screen.getByRole('button', { name: /previous/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })
  })
})
