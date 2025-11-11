import { ToastAction } from '@/components/ui/toast/toast'
import { Toaster } from '@/components/ui/toast/toaster'
import { useToast } from '@/components/ui/toast/use-toast'
import { describe, expect, it } from '@jest/globals'
import { act, render, renderHook, screen } from '@testing-library/react'

describe('Toaster component', () => {
  it('should render Toaster with toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
      })
    })

    render(<Toaster />)

    expect(screen.getByText('Test Title')).toBeDefined()
    expect(screen.getByText('Test Description')).toBeDefined()
  })

  it('should render toast without title', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        description: 'Only Description',
      })
    })

    render(<Toaster />)

    expect(screen.getByText('Only Description')).toBeDefined()
  })

  it('should render toast without description', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Only Title',
      })
    })

    render(<Toaster />)

    expect(screen.getByText('Only Title')).toBeDefined()
  })

  it('should render toast with action', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'With Action',
        action: <ToastAction altText="Undo">Undo</ToastAction>,
      })
    })

    render(<Toaster />)

    expect(screen.getByText('With Action')).toBeDefined()
    expect(screen.getByText('Undo')).toBeDefined()
  })

  it('should render empty Toaster when no toasts', () => {
    const { container } = render(<Toaster />)

    expect(container.querySelector('[data-radix-toast-viewport]')).toBeDefined()
  })

  it('should render multiple toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Toast 1' })
    })

    render(<Toaster />)

    expect(screen.getByText('Toast 1')).toBeDefined()
  })
})
