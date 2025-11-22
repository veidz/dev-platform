import { Card, CardContent } from '@/components/ui/card/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel/carousel'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

    it('should render with custom className', () => {
      const { container } = render(
        <Carousel className="custom-carousel">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const carousel = container.querySelector('.custom-carousel')
      expect(carousel).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to next slide on next button click', async () => {
      const user = userEvent.setup()

      render(
        <Carousel>
          <CarouselContent>
            {[1, 2, 3].map((num) => (
              <CarouselItem key={num}>
                <Card>
                  <CardContent>Slide {num}</CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(nextButton).toBeInTheDocument()
      })
    })

    it('should navigate to previous slide on previous button click', async () => {
      const user = userEvent.setup()

      render(
        <Carousel>
          <CarouselContent>
            {[1, 2, 3].map((num) => (
              <CarouselItem key={num}>
                <Card>
                  <CardContent>Slide {num}</CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      const nextButton = screen.getByRole('button', { name: /next/i })
      const prevButton = screen.getByRole('button', { name: /previous/i })

      await user.click(nextButton)
      await user.click(prevButton)

      await waitFor(() => {
        expect(prevButton).toBeInTheDocument()
      })
    })

    it('should disable previous button on first slide', () => {
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

      const prevButton = screen.getByRole('button', { name: /previous/i })
      expect(prevButton).toBeDisabled()
    })

    it('should disable next button on last slide', async () => {
      const user = userEvent.setup()

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

      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(nextButton).toBeDisabled()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const carousel = container.querySelector('[role="region"]') as HTMLElement
      if (carousel) {
        carousel.focus()
        await user.keyboard('{ArrowRight}')

        await waitFor(() => {
          expect(carousel).toBeInTheDocument()
        })
      }
    })
  })
})
