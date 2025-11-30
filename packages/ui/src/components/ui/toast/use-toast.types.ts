import type { ReactNode } from 'react'

import type { ToastActionElement, ToastProps } from './toast'

export interface ToasterToast
  extends Omit<ToastProps, 'title' | 'description'> {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
}

export type AddToastAction = {
  type: 'ADD_TOAST'
  toast: ToasterToast
}

export type UpdateToastAction = {
  type: 'UPDATE_TOAST'
  toast: Partial<ToasterToast> & { id: string }
}

export type DismissToastAction = {
  type: 'DISMISS_TOAST'
  toastId?: string
}

export type RemoveToastAction = {
  type: 'REMOVE_TOAST'
  toastId?: string
}

export type ToastAction =
  | AddToastAction
  | UpdateToastAction
  | DismissToastAction
  | RemoveToastAction

export interface ToastState {
  toasts: ToasterToast[]
}

export interface ToastInstance {
  id: string
  dismiss: () => void
  update: (props: Partial<ToasterToast>) => void
}

export interface UseToastReturn {
  toast: (props: Omit<ToasterToast, 'id'>) => ToastInstance
  dismiss: (toastId?: string) => void
  toasts: ToasterToast[]
}
