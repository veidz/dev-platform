import { render, screen } from '@testing-library/react'

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

    it('should render multiple avatars', () => {
      render(
        <div>
          <Avatar>
            <AvatarImage src="https://example.com/user1.jpg" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://example.com/user2.jpg" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
        </div>,
      )

      expect(screen.getByText('U1')).toBeInTheDocument()
      expect(screen.getByText('U2')).toBeInTheDocument()
    })
  })
})
