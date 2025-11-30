import * as React from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { describe, expect, it } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form/form'
import { Input } from '@/components/ui/input/input'

describe('Form Components', () => {
  describe('Form component', () => {
    it('should render form with children', () => {
      const TestForm = () => {
        const form = useForm()

        return (
          <Form {...form}>
            <form>
              <div>Form Content</div>
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByText('Form Content')).toBeDefined()
    })
  })

  describe('FormItem component', () => {
    it('should render form item', () => {
      const TestForm = () => {
        const form = useForm()

        return (
          <Form {...form}>
            <form>
              <FormItem>
                <div>Item Content</div>
              </FormItem>
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByText('Item Content')).toBeDefined()
    })

    it('should apply default classes', () => {
      const TestForm = () => {
        const form = useForm()

        return (
          <Form {...form}>
            <form>
              <FormItem data-testid="form-item">Content</FormItem>
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      const item = screen.getByTestId('form-item')
      expect(item.className).toContain('space-y-2')
    })

    it('should merge custom className', () => {
      const TestForm = () => {
        const form = useForm()

        return (
          <Form {...form}>
            <form>
              <FormItem className="custom-item" data-testid="form-item">
                Content
              </FormItem>
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      const item = screen.getByTestId('form-item')
      expect(item.className).toContain('custom-item')
      expect(item.className).toContain('space-y-2')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      const TestForm = () => {
        const form = useForm()

        return (
          <Form {...form}>
            <form>
              <FormItem ref={ref}>Content</FormItem>
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(ref.current).not.toBeNull()
    })
  })

  describe('FormField component', () => {
    it('should render controlled input', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            username: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByText('Username')).toBeDefined()
      expect(screen.getByRole('textbox')).toBeDefined()
    })

    it('should handle field value changes', async () => {
      const user = userEvent.setup()

      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            email: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      const input = screen.getByPlaceholderText('Enter email')

      await user.type(input, 'test@example.com')

      await waitFor(() => {
        expect((input as HTMLInputElement).value).toBe('test@example.com')
      })
    })
  })

  describe('FormLabel component', () => {
    it('should render label', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            name: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByText('Name')).toBeDefined()
    })

    it('should apply error styling when field has error', () => {
      const schema = z.object({
        email: z.string().email('Invalid email'),
      })

      const TestForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            email: 'invalid',
          },
        })

        form.trigger()

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      const label = screen.getByText('Email')

      waitFor(() => {
        expect(label.className).toContain('text-destructive')
      })
    })

    it('should forward ref', () => {
      const ref = { current: null }

      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel ref={ref}>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(ref.current).not.toBeNull()
    })
  })

  describe('FormControl component', () => {
    it('should render controlled input element', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            text: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Type here" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByPlaceholderText('Type here')).toBeDefined()
    })

    it('should set aria-invalid when field has error', async () => {
      const schema = z.object({
        email: z.string().email('Invalid email'),
      })

      const TestForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            email: 'invalid-email',
          },
        })

        React.useEffect(() => {
          form.trigger()
        }, [form])

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} data-testid="email-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)

      await waitFor(() => {
        const input = screen.getByTestId('email-input')
        expect(input.getAttribute('aria-invalid')).toBe('true')
      })
    })

    it('should forward ref', () => {
      const ref = { current: null }

      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormControl ref={ref}>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(ref.current).not.toBeNull()
    })
  })

  describe('FormDescription component', () => {
    it('should render description', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>This is a helper text</FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByText('This is a helper text')).toBeDefined()
    })

    it('should apply default classes', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Description</FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      const description = screen.getByText('Description')
      expect(description.className).toContain('text-muted-foreground')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription ref={ref}>Description</FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(ref.current).not.toBeNull()
    })
  })

  describe('FormMessage component', () => {
    it('should render error message when field has error', async () => {
      const schema = z.object({
        email: z.string().email('Invalid email address'),
      })

      const TestForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            email: 'invalid',
          },
        })

        React.useEffect(() => {
          form.trigger()
        }, [form])

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeDefined()
      })
    })

    it('should not render when no error', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      const { container } = render(<TestForm />)
      const messages = container.querySelectorAll('.text-destructive')
      expect(messages.length).toBe(0)
    })

    it('should render custom children when provided', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>Custom message</FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByText('Custom message')).toBeDefined()
    })

    it('should apply default classes', async () => {
      const schema = z.object({
        field: z.string().min(1, 'Required'),
      })

      const TestForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            field: '',
          },
        })

        React.useEffect(() => {
          form.trigger()
        }, [form])

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)

      await waitFor(() => {
        const message = screen.getByText('Required')
        expect(message.className).toContain('text-destructive')
        expect(message.className).toContain('font-medium')
      })
    })

    it('should forward ref', async () => {
      const ref = { current: null }
      const schema = z.object({
        field: z.string().min(1, 'Error'),
      })

      const TestForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            field: '',
          },
        })

        React.useEffect(() => {
          form.trigger()
        }, [form])

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage ref={ref} />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)

      await waitFor(() => {
        expect(ref.current).not.toBeNull()
      })
    })
  })

  describe('Form composition and validation', () => {
    it('should render complete form with multiple fields', () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            username: '',
            email: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Your public username</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormDescription>Your email address</FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)
      expect(screen.getByText('Username')).toBeDefined()
      expect(screen.getByText('Your public username')).toBeDefined()
      expect(screen.getByText('Email')).toBeDefined()
      expect(screen.getByText('Your email address')).toBeDefined()
    })

    it('should validate with Zod schema on submit', async () => {
      const user = userEvent.setup()
      const handleSubmit = jest.fn()

      const schema = z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        email: z.string().email('Invalid email address'),
      })

      const TestForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            username: '',
            email: '',
          },
        })

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )
      }

      render(<TestForm />)

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Username must be at least 3 characters'),
        ).toBeDefined()
        expect(screen.getByText('Invalid email address')).toBeDefined()
        expect(handleSubmit).not.toHaveBeenCalled()
      })
    })

    it('should submit valid form data', async () => {
      const user = userEvent.setup()
      const handleSubmit = jest.fn()

      const schema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
      })

      const TestForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            username: '',
            email: '',
          },
        })

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )
      }

      render(<TestForm />)

      const usernameInput = screen.getByPlaceholderText('Username')
      const emailInput = screen.getByPlaceholderText('Email')
      const submitButton = screen.getByText('Submit')

      await user.type(usernameInput, 'testuser')
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          {
            username: 'testuser',
            email: 'test@example.com',
          },
          expect.anything(),
        )
      })
    })
  })

  describe('useFormField hook', () => {
    it('should provide form field context', () => {
      let hookResult: ReturnType<typeof useFormField> | undefined

      const TestComponent = () => {
        hookResult = useFormField()
        return null
      }

      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            test: '',
          },
        })

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="test"
                render={() => (
                  <FormItem>
                    <TestComponent />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }

      render(<TestForm />)

      expect(hookResult).toBeDefined()
      expect(hookResult?.name).toBe('test')
      expect(hookResult?.formItemId).toBeDefined()
      expect(hookResult?.formDescriptionId).toBeDefined()
      expect(hookResult?.formMessageId).toBeDefined()
    })

    it('should throw error when used outside FormField', () => {
      const originalError = console.error
      console.error = () => {}

      const TestComponent = () => {
        useFormField()
        return null
      }

      const TestForm = () => {
        const form = useForm()

        return (
          <Form {...form}>
            <form>
              <FormItem>
                <TestComponent />
              </FormItem>
            </form>
          </Form>
        )
      }

      expect(() => render(<TestForm />)).toThrow(
        'useFormField should be used within <FormField>',
      )

      console.error = originalError
    })
  })
})
