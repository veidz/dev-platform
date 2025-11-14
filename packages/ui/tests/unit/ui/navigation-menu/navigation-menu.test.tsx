import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
  })
})
