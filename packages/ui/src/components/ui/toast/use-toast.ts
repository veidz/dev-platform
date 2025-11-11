import { useEffect, useState } from 'react'

import type {
  ToastAction,
  ToasterToast,
  ToastInstance,
  ToastState,
  UseToastReturn,
} from './use-toast.types'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string): void => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST': {
      const updatedToasts = state.toasts.map((t) => {
        if (t.id === action.toast.id) {
          return { ...t, ...action.toast }
        }
        return t
      })
      return {
        ...state,
        toasts: updatedToasts,
      }
    }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      const dismissedToasts = state.toasts.map((t) => {
        const shouldDismiss = t.id === toastId || toastId === undefined
        if (shouldDismiss) {
          return {
            ...t,
            open: false,
          }
        }
        return t
      })

      return {
        ...state,
        toasts: dismissedToasts,
      }
    }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: ToastState) => void> = []

let memoryState: ToastState = { toasts: [] }

function dispatch(action: ToastAction): void {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({ ...props }: Omit<ToasterToast, 'id'>): ToastInstance {
  const id = genId()

  const update = (updateProps: Partial<ToasterToast>): void =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...updateProps, id },
    })

  const dismiss = (): void => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) {
          dismiss()
        }
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

function useToast(): UseToastReturn {
  const [state, setState] = useState<ToastState>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return (): void => {
      const index = listeners.indexOf(setState)
      listeners.splice(index, 1)
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export type { ToasterToast } from './use-toast.types'
export { toast, useToast }
