import { render } from '@testing-library/react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar/avatar'

describe('Avatar', () => {
  describe('Rendering', () => {
    it('should render avatar with image and fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="Test User" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>,
      )

      const avatar = container.querySelector('span[class*="rounded-full"]')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveClass('rounded-full')
    })
  })
})
