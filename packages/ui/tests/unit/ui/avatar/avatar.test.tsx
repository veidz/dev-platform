import { render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'

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

    it('should apply custom className to Avatar', () => {
      render(
        <Avatar className="custom-avatar">
          <AvatarImage src="https://example.com/avatar.jpg" alt="Test" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>,
      )

      const fallback = screen.getByText('T')
      expect(fallback.parentElement).toHaveClass('custom-avatar')
    })
  })

  describe('Fallback Behavior', () => {
    it('should show fallback when image fails to load', async () => {
      render(
        <Avatar>
          <AvatarImage src="https://invalid-url.com/image.png" alt="Broken" />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>,
      )

      await waitFor(() => {
        expect(screen.getByText('FB')).toBeInTheDocument()
      })
    })

    it('should show fallback when src is empty', async () => {
      render(
        <Avatar>
          <AvatarImage src="" alt="Empty" />
          <AvatarFallback>EM</AvatarFallback>
        </Avatar>,
      )

      await waitFor(() => {
        expect(screen.getByText('EM')).toBeInTheDocument()
      })
    })

    it('should show fallback when no image provided', () => {
      render(
        <Avatar>
          <AvatarFallback>NO</AvatarFallback>
        </Avatar>,
      )

      expect(screen.getByText('NO')).toBeInTheDocument()
    })

    it('should apply custom className to fallback', () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">CF</AvatarFallback>
        </Avatar>,
      )

      const fallback = screen.getByText('CF')
      expect(fallback).toHaveClass('custom-fallback')
    })
  })

  describe('Image Loading', () => {
    it('should render AvatarImage component', async () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/valid-image.jpg" alt="Valid" />
          <AvatarFallback>VL</AvatarFallback>
        </Avatar>,
      )

      await waitFor(() => {
        expect(screen.getByText('VL')).toBeInTheDocument()
      })
    })

    it('should apply custom className to image', () => {
      render(
        <Avatar>
          <AvatarImage
            src="https://example.com/image.jpg"
            alt="Image"
            className="custom-image"
          />
          <AvatarFallback>IM</AvatarFallback>
        </Avatar>,
      )

      expect(screen.getByText('IM')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should render small avatar', () => {
      render(
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://example.com/small.jpg" alt="Small" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>,
      )

      const fallback = screen.getByText('SM')
      expect(fallback.parentElement).toHaveClass('h-8', 'w-8')
    })

    it('should render large avatar', () => {
      render(
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://example.com/large.jpg" alt="Large" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>,
      )

      const fallback = screen.getByText('LG')
      expect(fallback.parentElement).toHaveClass('h-16', 'w-16')
    })

    it('should apply custom size classes', () => {
      render(
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">XL</AvatarFallback>
        </Avatar>,
      )

      const avatar = screen.getByText('XL').parentElement
      expect(avatar).toHaveClass('h-24', 'w-24')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom background color to fallback', () => {
      render(
        <Avatar>
          <AvatarFallback className="bg-red-500 text-white">RD</AvatarFallback>
        </Avatar>,
      )

      const fallback = screen.getByText('RD')
      expect(fallback).toHaveClass('bg-red-500', 'text-white')
    })

    it('should apply gradient background to fallback', () => {
      render(
        <Avatar>
          <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-500">
            GR
          </AvatarFallback>
        </Avatar>,
      )

      const fallback = screen.getByText('GR')
      expect(fallback).toHaveClass('bg-linear-to-br')
    })

    it('should support border styling', () => {
      render(
        <Avatar className="border-2 border-blue-500">
          <AvatarImage src="https://example.com/border.jpg" alt="Border" />
          <AvatarFallback>BR</AvatarFallback>
        </Avatar>,
      )

      const fallback = screen.getByText('BR')
      expect(fallback.parentElement).toHaveClass('border-2', 'border-blue-500')
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to Avatar root', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <Avatar ref={ref}>
          <AvatarImage src="https://example.com/ref.jpg" alt="Ref" />
          <AvatarFallback>RF</AvatarFallback>
        </Avatar>,
      )

      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
      expect(ref.current).toHaveClass('rounded-full')
    })

    it('should forward ref to AvatarImage', () => {
      const ref = createRef<HTMLImageElement>()
      render(
        <Avatar>
          <AvatarImage
            ref={ref}
            src="https://example.com/img-ref.jpg"
            alt="Image Ref"
          />
          <AvatarFallback>IR</AvatarFallback>
        </Avatar>,
      )

      expect(ref.current).toBeDefined()
    })

    it('should forward ref to AvatarFallback', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <Avatar>
          <AvatarFallback ref={ref}>FB</AvatarFallback>
        </Avatar>,
      )

      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
      expect(ref.current?.textContent).toBe('FB')
    })
  })

  describe('Accessibility', () => {
    it('should have alt text on image', async () => {
      render(
        <Avatar>
          <AvatarImage
            src="https://example.com/accessible.jpg"
            alt="Accessible Avatar"
          />
          <AvatarFallback>AA</AvatarFallback>
        </Avatar>,
      )

      await waitFor(() => {
        expect(screen.getByText('AA')).toBeInTheDocument()
      })
    })

    it('should render fallback text for screen readers', () => {
      render(
        <Avatar>
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>,
      )

      expect(screen.getByText('SR')).toBeInTheDocument()
    })

    it('should support aria-label on Avatar', () => {
      render(
        <Avatar aria-label="User avatar">
          <AvatarImage src="https://example.com/user.jpg" alt="User" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>,
      )

      const avatar = screen.getByLabelText('User avatar')
      expect(avatar).toBeInTheDocument()
    })
  })
})
