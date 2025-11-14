import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu/navigation-menu'

describe('NavigationMenu', () => {
  describe('Rendering', () => {
    it('should render navigation menu', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/home">Home</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    it('should render multiple menu items', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/home">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about">About</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('should apply custom className to NavigationMenu', () => {
      const { container } = render(
        <NavigationMenu className="custom-nav">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/home">Home</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const nav = container.querySelector('.custom-nav')
      expect(nav).toBeInTheDocument()
    })
  })

  describe('Trigger and Content', () => {
    it('should render trigger with content', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Product 1</div>
                <div>Product 2</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(screen.getByText('Products')).toBeInTheDocument()
    })

    it('should toggle content on trigger click', async () => {
      const user = userEvent.setup()

      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Content Item</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const trigger = screen.getByText('Menu')
      expect(screen.queryByText('Content Item')).not.toBeInTheDocument()

      await user.click(trigger)
      expect(screen.getByText('Content Item')).toBeInTheDocument()
    })

    it('should show chevron icon in trigger', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Trigger</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const trigger = screen.getByText('Trigger')
      const svg = trigger.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Navigation Links', () => {
    it('should render navigation link with href', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Test Link</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const link = screen.getByText('Test Link')
      expect(link).toHaveAttribute('href', '/test')
    })

    it('should apply navigationMenuTriggerStyle utility', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle}
                href="/styled"
              >
                Styled Link
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const link = screen.getByText('Styled Link')
      expect(link).toHaveClass('rounded-md')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation', async () => {
      const user = userEvent.setup()

      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/first">First</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/second">Second</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const firstLink = screen.getByText('First')
      const secondLink = screen.getByText('Second')

      firstLink.focus()
      expect(firstLink).toHaveFocus()

      await user.tab()
      expect(secondLink).toHaveFocus()
    })

    it('should open trigger with Enter key', async () => {
      const user = userEvent.setup()

      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Keyboard Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Keyboard Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const trigger = screen.getByText('Keyboard Menu')
      trigger.focus()

      await user.keyboard('{Enter}')

      expect(screen.getByText('Keyboard Content')).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should render disabled trigger', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger disabled>
                Disabled Trigger
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const trigger = screen.getByText('Disabled Trigger')
      expect(trigger).toBeDisabled()
    })

    it('should not open content when trigger is disabled', async () => {
      const user = userEvent.setup()

      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger disabled>Disabled</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Should Not Appear</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const trigger = screen.getByText('Disabled')

      await user.click(trigger)

      expect(screen.queryByText('Should Not Appear')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on trigger', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>ARIA Trigger</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const trigger = screen.getByText('ARIA Trigger')
      expect(trigger).toHaveAttribute('aria-expanded')
    })

    it('should have navigation role', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Link</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(
        <NavigationMenu aria-label="Main navigation">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/home">Home</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const nav = screen.getByLabelText('Main navigation')
      expect(nav).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className to List', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList className="custom-list">
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Test</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const list = container.querySelector('.custom-list')
      expect(list).toBeInTheDocument()
    })

    it('should apply custom className to Trigger', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="custom-trigger">
                Custom
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const trigger = screen.getByText('Custom')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('should apply custom className to Content', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Trigger</NavigationMenuTrigger>
              <NavigationMenuContent className="custom-content">
                <div>Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(container.querySelector('.custom-content')).toBeDefined()
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to NavigationMenu root', () => {
      const ref = createRef<HTMLElement>()

      render(
        <NavigationMenu ref={ref}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Test</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current?.tagName).toBe('NAV')
    })

    it('should forward ref to NavigationMenuList', () => {
      const ref = createRef<HTMLUListElement>()

      render(
        <NavigationMenu>
          <NavigationMenuList ref={ref}>
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Test</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(ref.current).toBeInstanceOf(HTMLUListElement)
    })

    it('should forward ref to NavigationMenuTrigger', () => {
      const ref = createRef<HTMLButtonElement>()

      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger ref={ref}>Trigger</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('should forward ref to NavigationMenuContent', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Trigger</NavigationMenuTrigger>
              <NavigationMenuContent ref={ref}>
                <div>Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      expect(ref.current).toBeDefined()
    })
  })

  describe('Orientation', () => {
    it('should support horizontal orientation (default)', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Test</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const list = container.querySelector('ul')
      expect(list).toHaveClass('flex-1')
    })

    it('should support vertical orientation', () => {
      render(
        <NavigationMenu orientation="vertical">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Test</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })
  })
})
