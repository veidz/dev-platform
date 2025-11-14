import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
  })
})
