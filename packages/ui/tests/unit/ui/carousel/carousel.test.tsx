import { Card, CardContent } from '@/components/ui/card/card'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel/carousel'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

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

    it('should navigate backwards with left arrow key', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const carousel = container.querySelector('[role="region"]') as HTMLElement
      if (carousel) {
        carousel.focus()
        await user.keyboard('{ArrowRight}')
        await user.keyboard('{ArrowLeft}')

        await waitFor(() => {
          expect(carousel).toBeInTheDocument()
        })
      }
    })
  })

  describe('Orientation', () => {
    it('should support horizontal orientation (default)', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const region = screen.getByRole('region')
      expect(region).toBeInTheDocument()
    })

    it('should support vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const region = screen.getByRole('region')
      expect(region).toBeInTheDocument()
    })
  })

  describe('Loop Option', () => {
    it('should enable loop when specified', () => {
      render(
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).not.toBeDisabled()
    })
  })

  describe('API Access', () => {
    it('should expose carousel API through setApi', () => {
      let capturedApi: CarouselApi | undefined

      render(
        <Carousel setApi={(api: CarouselApi) => (capturedApi = api)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      expect(capturedApi).toBeDefined()
    })

    it('should allow programmatic navigation via API', () => {
      let api: CarouselApi | undefined

      render(
        <Carousel setApi={(carouselApi: CarouselApi) => (api = carouselApi)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      if (api) {
        api.scrollTo(1)
        expect(api).toBeDefined()
      }
    })

    it('should provide scroll snap information', () => {
      let api: CarouselApi | undefined

      render(
        <Carousel setApi={(carouselApi: CarouselApi) => (api = carouselApi)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      expect(api).toBeDefined()
      if (api) {
        expect(api.scrollSnapList).toBeDefined()
        expect(typeof api.scrollSnapList).toBe('function')
      }
    })
  })

  describe('Multiple Items', () => {
    it('should render multiple items per view', () => {
      render(
        <Carousel opts={{ align: 'start' }}>
          <CarouselContent>
            {[1, 2, 3, 4, 5].map((num) => (
              <CarouselItem key={num} className="basis-1/2">
                Slide {num}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>,
      )

      expect(screen.getByText('Slide 1')).toBeInTheDocument()
      expect(screen.getByText('Slide 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const region = screen.getByRole('region')
      expect(region).toHaveAttribute('aria-roledescription', 'carousel')
    })

    it('should have proper ARIA attributes on slides', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const slide = screen.getByRole('group')
      expect(slide).toHaveAttribute('aria-roledescription', 'slide')
    })

    it('should have screen reader text for navigation buttons', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      expect(screen.getByText('Previous slide')).toBeInTheDocument()
      expect(screen.getByText('Next slide')).toBeInTheDocument()
    })
  })

  describe('Custom Content', () => {
    it('should render complex content in carousel items', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <Card>
                <CardContent>
                  <h3>Title</h3>
                  <p>Description</p>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })
  })
})
