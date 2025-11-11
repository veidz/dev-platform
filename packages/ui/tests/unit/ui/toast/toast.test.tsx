import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast/toast'
import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

describe('Toast Components', () => {
  describe('ToastProvider component', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div>Test Content</div>
        </ToastProvider>,
      )

      expect(screen.getByText('Test Content')).toBeDefined()
    })
  })

  describe('ToastViewport component', () => {
    it('should render viewport', () => {
      render(
        <ToastProvider>
          <ToastViewport data-testid="viewport" />
        </ToastProvider>,
      )

      const viewport = screen.getByTestId('viewport')
      expect(viewport).toBeDefined()
    })

    it('should apply default classes', () => {
      render(
        <ToastProvider>
          <ToastViewport data-testid="viewport" />
        </ToastProvider>,
      )

      const viewport = screen.getByTestId('viewport')
      expect(viewport.className).toContain('fixed')
      expect(viewport.className).toContain('top-0')
      expect(viewport.className).toContain('z-100')
    })

    it('should merge custom className', () => {
      render(
        <ToastProvider>
          <ToastViewport className="custom-viewport" data-testid="viewport" />
        </ToastProvider>,
      )

      const viewport = screen.getByTestId('viewport')
      expect(viewport.className).toContain('custom-viewport')
      expect(viewport.className).toContain('fixed')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <ToastProvider>
          <ToastViewport ref={ref} />
        </ToastProvider>,
      )

      expect(ref.current).not.toBeNull()
    })
  })

  describe('Toast component', () => {
    it('should render toast content', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Toast Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(screen.getByText('Toast Title')).toBeDefined()
    })

    it('should apply default variant classes', () => {
      render(
        <ToastProvider>
          <Toast open data-testid="toast">
            Content
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const toast = screen.getByTestId('toast')
      expect(toast.className).toContain('border')
      expect(toast.className).toContain('bg-background')
    })

    it('should apply success variant', () => {
      render(
        <ToastProvider>
          <Toast open variant="success" data-testid="toast">
            Success
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const toast = screen.getByTestId('toast')
      expect(toast.className).toContain('border-green-500')
      expect(toast.className).toContain('bg-green-500/10')
    })

    it('should apply info variant', () => {
      render(
        <ToastProvider>
          <Toast open variant="info" data-testid="toast">
            Info
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const toast = screen.getByTestId('toast')
      expect(toast.className).toContain('border-blue-500')
      expect(toast.className).toContain('bg-blue-500/10')
    })

    it('should apply destructive variant', () => {
      render(
        <ToastProvider>
          <Toast open variant="destructive" data-testid="toast">
            Error
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const toast = screen.getByTestId('toast')
      expect(toast.className).toContain('destructive')
      expect(toast.className).toContain('border-destructive')
    })

    it('should merge custom className', () => {
      render(
        <ToastProvider>
          <Toast open className="custom-toast" data-testid="toast">
            Content
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const toast = screen.getByTestId('toast')
      expect(toast.className).toContain('custom-toast')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <ToastProvider>
          <Toast open ref={ref}>
            Content
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(ref.current).not.toBeNull()
    })
  })

  describe('ToastTitle component', () => {
    it('should render title', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>My Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(screen.getByText('My Title')).toBeDefined()
    })

    it('should apply default classes', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const title = screen.getByText('Title')
      expect(title.className).toContain('text-sm')
      expect(title.className).toContain('font-semibold')
    })

    it('should merge custom className', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle className="custom-title">Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const title = screen.getByText('Title')
      expect(title.className).toContain('custom-title')
      expect(title.className).toContain('text-sm')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle ref={ref}>Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(ref.current).not.toBeNull()
    })
  })

  describe('ToastDescription component', () => {
    it('should render description', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastDescription>My Description</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(screen.getByText('My Description')).toBeDefined()
    })

    it('should apply default classes', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastDescription>Description</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const description = screen.getByText('Description')
      expect(description.className).toContain('text-sm')
      expect(description.className).toContain('opacity-90')
    })

    it('should merge custom className', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastDescription className="custom-desc">
              Description
            </ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const description = screen.getByText('Description')
      expect(description.className).toContain('custom-desc')
      expect(description.className).toContain('text-sm')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastDescription ref={ref}>Description</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(ref.current).not.toBeNull()
    })
  })

  describe('ToastAction component', () => {
    it('should render action button', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Retry">Retry</ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(screen.getByText('Retry')).toBeDefined()
    })

    it('should apply default classes', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Action">Action</ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const action = screen.getByText('Action')
      expect(action.className).toContain('inline-flex')
      expect(action.className).toContain('h-8')
      expect(action.className).toContain('rounded-md')
    })

    it('should merge custom className', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Action" className="custom-action">
              Action
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const action = screen.getByText('Action')
      expect(action.className).toContain('custom-action')
      expect(action.className).toContain('inline-flex')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Action" ref={ref}>
              Action
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(ref.current).not.toBeNull()
    })

    it('should be clickable', () => {
      const handleClick = jest.fn()

      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Action" onClick={handleClick}>
              Click Me
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const action = screen.getByText('Click Me')
      expect(action).toBeDefined()
      expect(action.tagName).toBe('BUTTON')
    })
  })

  describe('ToastClose component', () => {
    it('should render close button', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const closeButton = screen.getByRole('button')
      expect(closeButton).toBeDefined()
    })

    it('should apply default classes', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const closeButton = screen.getByRole('button')
      expect(closeButton.className).toContain('absolute')
      expect(closeButton.className).toContain('right-1')
      expect(closeButton.className).toContain('top-1')
    })

    it('should merge custom className', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastClose className="custom-close" />
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      const closeButton = screen.getByRole('button')
      expect(closeButton.className).toContain('custom-close')
      expect(closeButton.className).toContain('absolute')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastClose ref={ref} />
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(ref.current).not.toBeNull()
    })
  })

  describe('Toast composition', () => {
    it('should render complete toast', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Your action was completed</ToastDescription>
            <ToastAction altText="Undo">Undo</ToastAction>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(screen.getByText('Success')).toBeDefined()
      expect(screen.getByText('Your action was completed')).toBeDefined()
      expect(screen.getByText('Undo')).toBeDefined()
      const closeButtons = screen.getAllByRole('button')
      expect(closeButtons.length).toBeGreaterThan(1)
    })

    it('should render minimal toast', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Simple Toast</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>,
      )

      expect(screen.getByText('Simple Toast')).toBeDefined()
    })
  })
})
