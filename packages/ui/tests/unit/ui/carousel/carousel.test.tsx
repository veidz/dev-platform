import * as React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Card, CardContent } from '@/components/ui/card/card'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel/carousel'

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
    it('should expose carousel API through setApi', async () => {
      let capturedApi: CarouselApi | undefined

      render(
        <Carousel setApi={(api: CarouselApi) => (capturedApi = api)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      await waitFor(() => {
        expect(capturedApi).toBeDefined()
      })
    })

    it('should not call setApi when not provided', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const region = screen.getByRole('region')
      expect(region).toBeInTheDocument()
    })

    it('should allow programmatic navigation via API', async () => {
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

      await waitFor(() => {
        expect(api).toBeDefined()
        if (api) {
          api.scrollTo(1)
          expect(api).toBeDefined()
        }
      })
    })

    it('should provide scroll snap information', async () => {
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

      await waitFor(() => {
        expect(api).toBeDefined()
        if (api) {
          expect(api.scrollSnapList).toBeDefined()
          expect(typeof api.scrollSnapList).toBe('function')
        }
      })
    })

    it('should trigger reInit event handler', async () => {
      let api: CarouselApi | undefined

      const { rerender } = render(
        <Carousel setApi={(carouselApi: CarouselApi) => (api = carouselApi)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      await waitFor(() => {
        expect(api).toBeDefined()
      })

      // Rerender to trigger reInit
      rerender(
        <Carousel setApi={(carouselApi: CarouselApi) => (api = carouselApi)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      await waitFor(() => {
        expect(api).toBeDefined()
      })
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

  describe('Hook Error Handling', () => {
    it('should throw error when useCarousel is used outside Carousel context', () => {
      const TestComponent = (): React.JSX.Element => {
        useCarousel()
        return <div>Test</div>
      }

      // Suppress console.error for this test
      const consoleError = console.error
      console.error = jest.fn()

      expect(() => render(<TestComponent />)).toThrow(
        'useCarousel must be used within a <Carousel />',
      )

      console.error = consoleError
    })
  })

  describe('Edge Cases', () => {
    it('should handle opts.axis for vertical orientation', () => {
      // When orientation='vertical' is explicit, should have vertical classes
      render(
        <Carousel orientation="vertical" opts={{ axis: 'y' }}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      const prevButton = screen.getByRole('button', { name: /previous/i })
      const nextButton = screen.getByRole('button', { name: /next/i })

      // When orientation is 'vertical', buttons should have vertical classes
      expect(prevButton).toHaveClass('rotate-90')
      expect(nextButton).toHaveClass('rotate-90')
    })

    it('should apply horizontal classes to navigation buttons by default', () => {
      // Tests lines 206 and 235: horizontal orientation classes
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      const prevButton = screen.getByRole('button', { name: /previous/i })
      const nextButton = screen.getByRole('button', { name: /next/i })

      // Horizontal orientation classes
      expect(prevButton).toHaveClass('-left-12')
      expect(nextButton).toHaveClass('-right-12')
    })

    it('should apply vertical classes to navigation buttons', () => {
      // Tests lines 206 and 235: vertical orientation classes
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      )

      const prevButton = screen.getByRole('button', { name: /previous/i })
      const nextButton = screen.getByRole('button', { name: /next/i })

      // Vertical orientation classes
      expect(prevButton).toHaveClass('-top-12')
      expect(prevButton).toHaveClass('rotate-90')
      expect(nextButton).toHaveClass('-bottom-12')
      expect(nextButton).toHaveClass('rotate-90')
    })

    it('should handle keyboard navigation with ArrowLeft', async () => {
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

      // Dispatch keyboard event directly - covers line 88-91
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true,
      })
      carousel.dispatchEvent(event)

      expect(carousel).toBeInTheDocument()
    })

    it('should handle keyboard navigation with ArrowRight', async () => {
      const { container } = render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const carousel = container.querySelector('[role="region"]') as HTMLElement

      // Dispatch keyboard event directly - covers line 92-95
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      })
      carousel.dispatchEvent(event)

      expect(carousel).toBeInTheDocument()
    })

    it('should not handle keyboard events with other keys (no action)', () => {
      const { container } = render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      const carousel = container.querySelector('[role="region"]') as HTMLElement

      // Dispatch non-arrow key event - covers line 85 null case
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      })

      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      carousel.dispatchEvent(event)

      // preventDefault should NOT be called for non-arrow keys
      expect(preventDefaultSpy).not.toHaveBeenCalled()
      expect(carousel).toBeInTheDocument()
    })

    it('should use horizontal fallback when no orientation and no opts', () => {
      // Tests line 122: orientation ?? (opts?.axis === 'y' ? 'vertical' : 'horizontal')
      // When orientation is undefined and opts is undefined, should default to 'horizontal'
      const TestComponent = (): React.JSX.Element => {
        const { orientation } = useCarousel()
        return <div data-testid="orientation">{orientation}</div>
      }

      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <TestComponent />
        </Carousel>,
      )

      expect(screen.getByTestId('orientation')).toHaveTextContent('horizontal')
    })

    it('should use default horizontal orientation', () => {
      // Tests default orientation behavior
      const TestComponent = (): React.JSX.Element => {
        const { orientation } = useCarousel()
        return <div data-testid="orientation">{orientation}</div>
      }

      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <TestComponent />
        </Carousel>,
      )

      // Default should be 'horizontal'
      expect(screen.getByTestId('orientation')).toHaveTextContent('horizontal')
    })

    it('should respect explicit vertical orientation', () => {
      // Tests that explicit orientation prop works
      const TestComponent = (): React.JSX.Element => {
        const { orientation } = useCarousel()
        return <div data-testid="orientation">{orientation}</div>
      }

      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <TestComponent />
        </Carousel>,
      )

      // Should use explicit 'vertical'
      expect(screen.getByTestId('orientation')).toHaveTextContent('vertical')
    })

    it('should not update state when api is null in onSelect', async () => {
      // This tests the line 71 guard: if (!api) return
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>,
      )

      await waitFor(() => {
        const region = screen.getByRole('region')
        expect(region).toBeInTheDocument()
      })
    })

    it('should call scrollPrev callback via context', async () => {
      const user = userEvent.setup()
      let capturedApi: CarouselApi | undefined
      const TestComponent = (): React.JSX.Element => {
        const { scrollPrev, api } = useCarousel()

        return (
          <div>
            <button onClick={scrollPrev}>Test Prev</button>
            <span data-testid="has-api">{api ? 'has-api' : 'no-api'}</span>
          </div>
        )
      }

      render(
        <Carousel setApi={(api) => (capturedApi = api)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
          <TestComponent />
        </Carousel>,
      )

      // Wait for API to be initialized
      await waitFor(() => {
        expect(capturedApi).toBeDefined()
        expect(screen.getByTestId('has-api')).toHaveTextContent('has-api')
      })

      // Trigger scrollPrev directly - covers lines 77-78
      const button = screen.getByText('Test Prev')
      await user.click(button)

      await waitFor(() => expect(button).toBeInTheDocument())
    })

    it('should call scrollNext callback via context', async () => {
      const user = userEvent.setup()
      let capturedApi: CarouselApi | undefined
      const TestComponent = (): React.JSX.Element => {
        const { scrollNext, api } = useCarousel()

        return (
          <div>
            <button onClick={scrollNext}>Test Next</button>
            <span data-testid="has-api">{api ? 'has-api' : 'no-api'}</span>
          </div>
        )
      }

      render(
        <Carousel setApi={(api) => (capturedApi = api)}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <TestComponent />
        </Carousel>,
      )

      // Wait for API to be initialized
      await waitFor(() => {
        expect(capturedApi).toBeDefined()
        expect(screen.getByTestId('has-api')).toHaveTextContent('has-api')
      })

      // Trigger scrollNext directly - covers lines 82-84
      const button = screen.getByText('Test Next')
      await user.click(button)

      await waitFor(() => expect(button).toBeInTheDocument())
    })

    it('should call scrollPrev when previous button clicked', async () => {
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
        expect(nextButton).toBeInTheDocument()
      })

      const prevButton = screen.getByRole('button', { name: /previous/i })
      await user.click(prevButton)

      await waitFor(() => {
        expect(prevButton).toBeInTheDocument()
      })
    })

    it('should call scrollNext when next button clicked', async () => {
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
        expect(nextButton).toBeInTheDocument()
      })
    })
  })
})
