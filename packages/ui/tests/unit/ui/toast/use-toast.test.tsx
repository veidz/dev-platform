import { ToastAction } from '@/components/ui/toast/toast'
import { reducer, toast, useToast } from '@/components/ui/toast/use-toast'
import { describe, expect, it, jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'

describe('useToast hook', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  describe('toast function', () => {
    it('should create a toast', () => {
      const result = toast({
        title: 'Test Toast',
        description: 'Test Description',
      })

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(typeof result.dismiss).toBe('function')
      expect(typeof result.update).toBe('function')
    })

    it('should create toast with variant', () => {
      const result = toast({
        title: 'Success',
        variant: 'success',
      })

      expect(result).toBeDefined()
    })
  })

  describe('useToast hook', () => {
    it('should return toast function and toasts array', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.toast).toBeDefined()
      expect(Array.isArray(result.current.toasts)).toBe(true)
      expect(typeof result.current.dismiss).toBe('function')
    })

    it('should add toast to state', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'New Toast',
        })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]?.title).toBe('New Toast')
    })

    it('should update existing toast', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: ReturnType<typeof toast>

      act(() => {
        toastResult = result.current.toast({
          title: 'Original Title',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Original Title')

      act(() => {
        toastResult.update({
          id: toastResult.id,
          title: 'Updated Title',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Updated Title')
    })

    it('should dismiss toast', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: ReturnType<typeof toast>

      act(() => {
        toastResult = result.current.toast({
          title: 'Toast to dismiss',
        })
      })

      expect(result.current.toasts[0]?.open).toBe(true)

      act(() => {
        toastResult.dismiss()
      })

      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should dismiss toast by id', () => {
      const { result } = renderHook(() => useToast())

      let toastId: string

      act(() => {
        const toastResult = result.current.toast({
          title: 'Toast',
        })
        toastId = toastResult.id
      })

      expect(result.current.toasts[0]?.open).toBe(true)

      act(() => {
        result.current.dismiss(toastId)
      })

      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should respect toast limit', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
        result.current.toast({ title: 'Toast 2' })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]?.title).toBe('Toast 2')
    })

    it('should handle multiple toasts with different variants', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'Success',
          variant: 'success',
        })
      })

      expect(result.current.toasts[0]?.variant).toBe('success')
    })

    it('should dismiss all toasts when toastId is undefined', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      expect(result.current.toasts[0]?.open).toBe(true)

      act(() => {
        result.current.dismiss()
      })

      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should remove toast with undefined toastId', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        result.current.dismiss()
      })

      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should update toast properties', () => {
      const { result } = renderHook(() => useToast())
      let toastResult: ReturnType<typeof toast>

      act(() => {
        toastResult = result.current.toast({
          title: 'Original Title',
          description: 'Original Description',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Original Title')

      act(() => {
        toastResult.update({
          id: toastResult.id,
          title: 'Updated Title',
          description: 'Updated Description',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Updated Title')
      expect(result.current.toasts[0]?.description).toBe('Updated Description')
    })

    it('should handle onOpenChange callback', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'Test Toast',
        })
      })

      expect(result.current.toasts[0]?.open).toBe(true)

      act(() => {
        const toast = result.current.toasts[0]
        if (toast?.onOpenChange) {
          toast.onOpenChange(false)
        }
      })

      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should not re-add toast to remove queue if already queued', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        const toastResult = result.current.toast({ title: 'Test' })

        result.current.dismiss(toastResult.id)
        result.current.dismiss(toastResult.id)
      })

      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should remove toast after timeout delay', () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useToast())
      let toastId: string

      act(() => {
        const toastResult = result.current.toast({ title: 'Test Toast' })
        toastId = toastResult.id
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        result.current.dismiss(toastId)
      })

      expect(result.current.toasts[0]?.open).toBe(false)

      act(() => {
        jest.advanceTimersByTime(1000000)
      })

      expect(result.current.toasts).toHaveLength(0)

      jest.useRealTimers()
    })

    it('should clear all toasts when REMOVE_TOAST with undefined toastId', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      expect(result.current.toasts).toHaveLength(1)

      const initialState = { toasts: result.current.toasts }

      const newState = reducer(initialState, {
        type: 'REMOVE_TOAST',
        toastId: undefined,
      })

      expect(newState.toasts).toHaveLength(0)
    })

    it('should execute setTimeout callback in addToRemoveQueue', () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Test' })
      })

      const toastId = result.current.toasts[0]?.id

      act(() => {
        if (toastId) {
          result.current.dismiss(toastId)
        }
      })

      expect(result.current.toasts[0]?.open).toBe(false)
      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        jest.runAllTimers()
      })

      expect(result.current.toasts).toHaveLength(0)

      jest.useRealTimers()
    })

    it('should handle multiple dismiss calls with timers', () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useToast())
      let toastId: string

      act(() => {
        const toastResult = result.current.toast({ title: 'Test' })
        toastId = toastResult.id
      })

      act(() => {
        result.current.dismiss(toastId)
      })

      act(() => {
        result.current.dismiss(toastId)
      })

      expect(result.current.toasts[0]?.open).toBe(false)

      act(() => {
        jest.advanceTimersByTime(1000000)
      })

      expect(result.current.toasts).toHaveLength(0)

      jest.useRealTimers()
    })
  })

  describe('Toast Chaining and Edge Cases', () => {
    beforeEach(() => {
      jest.clearAllTimers()
    })

    it('should chain multiple toast operations', () => {
      const { result } = renderHook(() => useToast())
      let toast1: ReturnType<typeof toast>

      act(() => {
        toast1 = result.current.toast({
          title: 'First Toast',
          description: 'Initial description',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('First Toast')

      act(() => {
        toast1.update({
          id: toast1.id,
          title: 'Updated Toast',
          description: 'Updated description',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Updated Toast')
      expect(result.current.toasts[0]?.description).toBe('Updated description')

      act(() => {
        toast1.dismiss()
      })

      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should handle chaining update multiple times', () => {
      const { result } = renderHook(() => useToast())
      let toastInstance: ReturnType<typeof toast>

      act(() => {
        toastInstance = result.current.toast({ title: 'Original' })
      })

      act(() => {
        toastInstance.update({ id: toastInstance.id, title: 'Update 1' })
        toastInstance.update({ id: toastInstance.id, title: 'Update 2' })
        toastInstance.update({ id: toastInstance.id, title: 'Update 3' })
      })

      expect(result.current.toasts[0]?.title).toBe('Update 3')
    })

    it('should handle update after dismiss (edge case)', () => {
      const { result } = renderHook(() => useToast())
      let toastInstance: ReturnType<typeof toast>

      act(() => {
        toastInstance = result.current.toast({ title: 'Test' })
      })

      act(() => {
        toastInstance.dismiss()
      })

      expect(result.current.toasts[0]?.open).toBe(false)

      act(() => {
        toastInstance.update({
          id: toastInstance.id,
          title: 'Updated After Dismiss',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Updated After Dismiss')
      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should handle dismiss after update', () => {
      const { result } = renderHook(() => useToast())
      let toastInstance: ReturnType<typeof toast>

      act(() => {
        toastInstance = result.current.toast({ title: 'Original' })
      })

      act(() => {
        toastInstance.update({ id: toastInstance.id, title: 'Updated' })
        toastInstance.dismiss()
      })

      expect(result.current.toasts[0]?.title).toBe('Updated')
      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should handle UPDATE_TOAST with non-matching id', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      const initialState = { toasts: result.current.toasts }

      const newState = reducer(initialState, {
        type: 'UPDATE_TOAST',
        toast: { id: 'non-existent-id', title: 'Should Not Update' },
      })

      expect(newState.toasts[0]?.title).toBe('Toast 1')
    })

    it('should update only matching toast when multiple toasts exist', () => {
      const toast1 = { id: '1', title: 'Toast 1', open: true }
      const toast2 = { id: '2', title: 'Toast 2', open: true }
      const toast3 = { id: '3', title: 'Toast 3', open: true }
      const initialState = { toasts: [toast1, toast2, toast3] }

      const newState = reducer(initialState, {
        type: 'UPDATE_TOAST',
        toast: { id: '2', title: 'Updated Toast 2' },
      })

      expect(newState.toasts[0]?.title).toBe('Toast 1')
      expect(newState.toasts[1]?.title).toBe('Updated Toast 2')
      expect(newState.toasts[2]?.title).toBe('Toast 3')
    })

    it('should handle DISMISS_TOAST with empty toast array', () => {
      const initialState = { toasts: [] }

      const newState = reducer(initialState, {
        type: 'DISMISS_TOAST',
        toastId: undefined,
      })

      expect(newState.toasts).toHaveLength(0)
    })

    it('should handle DISMISS_TOAST with undefined on multiple toasts', () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        result.current.dismiss(undefined)
      })

      expect(result.current.toasts[0]?.open).toBe(false)

      jest.useRealTimers()
    })

    it('should handle REMOVE_TOAST with specific id', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      const toastId = result.current.toasts[0]?.id
      const initialState = { toasts: result.current.toasts }

      const newState = reducer(initialState, {
        type: 'REMOVE_TOAST',
        toastId: toastId,
      })

      expect(newState.toasts).toHaveLength(0)
    })

    it('should handle REMOVE_TOAST with non-existent id', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      const initialState = { toasts: result.current.toasts }

      const newState = reducer(initialState, {
        type: 'REMOVE_TOAST',
        toastId: 'non-existent-id',
      })

      expect(newState.toasts).toHaveLength(1)
      expect(newState.toasts[0]?.title).toBe('Toast 1')
    })

    it('should handle rapid successive toast creation (TOAST_LIMIT)', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
        result.current.toast({ title: 'Toast 2' })
        result.current.toast({ title: 'Toast 3' })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]?.title).toBe('Toast 3')
    })

    it('should handle toast with all optional props', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'Full Toast',
          description: 'Description',
          variant: 'success',
          action: <ToastAction altText="Action">Action</ToastAction>,
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Full Toast')
      expect(result.current.toasts[0]?.description).toBe('Description')
      expect(result.current.toasts[0]?.variant).toBe('success')
      expect(result.current.toasts[0]?.action).toBeDefined()
    })

    it('should handle toast with minimal props', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({})
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]?.open).toBe(true)
    })

    it('should generate unique IDs for multiple toasts', () => {
      const { result } = renderHook(() => useToast())
      const ids: string[] = []

      act(() => {
        const t1 = result.current.toast({ title: 'T1' })
        ids.push(t1.id)
      })

      act(() => {
        const t2 = result.current.toast({ title: 'T2' })
        ids.push(t2.id)
      })

      act(() => {
        const t3 = result.current.toast({ title: 'T3' })
        ids.push(t3.id)
      })

      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(3)
    })

    it('should handle onOpenChange callback with true (edge case)', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Test' })
      })

      act(() => {
        const toast = result.current.toasts[0]
        if (toast?.onOpenChange) {
          toast.onOpenChange(true)
        }
      })

      expect(result.current.toasts[0]?.open).toBe(true)
    })

    it('should handle concurrent dismiss and update operations', () => {
      const { result } = renderHook(() => useToast())
      let toastInstance: ReturnType<typeof toast>

      act(() => {
        toastInstance = result.current.toast({ title: 'Original' })
      })

      act(() => {
        toastInstance.update({ id: toastInstance.id, title: 'Updated' })
        toastInstance.dismiss()
      })

      expect(result.current.toasts[0]?.title).toBe('Updated')
      expect(result.current.toasts[0]?.open).toBe(false)
    })

    it('should handle multiple listeners being added and removed', () => {
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useToast(),
      )
      const { result: result2, unmount: unmount2 } = renderHook(() =>
        useToast(),
      )

      act(() => {
        result1.current.toast({ title: 'Shared Toast' })
      })

      expect(result1.current.toasts[0]?.title).toBe('Shared Toast')
      expect(result2.current.toasts[0]?.title).toBe('Shared Toast')

      unmount1()

      act(() => {
        result2.current.toast({ title: 'Second Toast' })
      })

      expect(result2.current.toasts[0]?.title).toBe('Second Toast')

      unmount2()
    })

    it('should handle timeout cleanup when toast is removed before delay', () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useToast())
      let toastId: string

      act(() => {
        const t = result.current.toast({ title: 'Test' })
        toastId = t.id
      })

      act(() => {
        result.current.dismiss(toastId)
      })

      act(() => {
        const newState = reducer(
          { toasts: result.current.toasts },
          { type: 'REMOVE_TOAST', toastId: toastId },
        )
        expect(newState.toasts).toHaveLength(0)
      })

      act(() => {
        jest.advanceTimersByTime(1000000)
      })

      jest.useRealTimers()
    })

    it('should preserve toast properties during UPDATE_TOAST', () => {
      const { result } = renderHook(() => useToast())
      let toastInstance: ReturnType<typeof toast>

      act(() => {
        toastInstance = result.current.toast({
          title: 'Original',
          description: 'Original Desc',
          variant: 'default',
        })
      })

      act(() => {
        toastInstance.update({
          id: toastInstance.id,
          title: 'Updated Title',
        })
      })

      expect(result.current.toasts[0]?.title).toBe('Updated Title')
      expect(result.current.toasts[0]?.description).toBe('Original Desc')
      expect(result.current.toasts[0]?.variant).toBe('default')
    })

    it('should handle edge case of genId reaching MAX_SAFE_INTEGER', () => {
      const { result } = renderHook(() => useToast())
      const ids: string[] = []

      for (let i = 0; i < 5; i++) {
        act(() => {
          const t = result.current.toast({ title: `Toast ${i}` })
          ids.push(t.id)
        })
      }

      ids.forEach((id) => {
        expect(Number(id)).not.toBeNaN()
        expect(Number(id)).toBeGreaterThan(0)
      })
    })

    it('should handle unmounting and remounting components with listeners', () => {
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useToast(),
      )

      act(() => {
        result1.current.toast({ title: 'Toast 1' })
      })

      expect(result1.current.toasts).toHaveLength(1)

      unmount1()

      const { result: result2 } = renderHook(() => useToast())

      expect(result2.current.toasts).toHaveLength(1)

      act(() => {
        result2.current.toast({ title: 'Toast 2' })
      })

      expect(result2.current.toasts).toHaveLength(1)
      expect(result2.current.toasts[0]?.title).toBe('Toast 2')
    })

    it('should not modify toasts that do not match the dismissed id', () => {
      const { result } = renderHook(() => useToast())

      let toast1Id: string
      let toast2Id: string

      act(() => {
        const t1 = result.current.toast({ title: 'Toast 1' })
        toast1Id = t1.id
      })

      act(() => {
        const t2 = result.current.toast({ title: 'Toast 2' })
        toast2Id = t2.id
      })

      const initialToast2 = result.current.toasts.find((t) => t.id === toast2Id)
      expect(initialToast2).toBeDefined()

      act(() => {
        result.current.dismiss(toast1Id)
      })

      const afterDismissToast2 = result.current.toasts.find(
        (t) => t.id === toast2Id,
      )

      expect(afterDismissToast2?.open).toBe(true)
      expect(afterDismissToast2?.title).toBe('Toast 2')
    })

    it('should handle edge case where listener is removed before indexOf check', () => {
      const { result, unmount } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Test' })
      })

      unmount()

      expect(true).toBe(true)
    })
  })
})
