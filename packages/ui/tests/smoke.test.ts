import { describe, expect, it } from '@jest/globals'

describe('Smoke Tests - Package Exports', () => {
  it('should export Button component', async () => {
    const { Button } = await import('@/components/ui/button')
    expect(Button).toBeDefined()
    expect(typeof Button).toBe('object')
  })

  it('should export Input component', async () => {
    const { Input } = await import('@/components/ui/input')
    expect(Input).toBeDefined()
    expect(typeof Input).toBe('object')
  })

  it('should export Label component', async () => {
    const { Label } = await import('@/components/ui/label')
    expect(Label).toBeDefined()
    expect(typeof Label).toBe('object')
  })

  it('should export design tokens - colors', async () => {
    const { colors, rawColors } = await import('@/tokens')
    expect(colors).toBeDefined()
    expect(rawColors).toBeDefined()
    expect(colors.primary).toBeDefined()
    expect(rawColors.background).toBeDefined()
  })

  it('should export design tokens - spacing', async () => {
    const { spacing, semanticSpacing } = await import('@/tokens')
    expect(spacing).toBeDefined()
    expect(semanticSpacing).toBeDefined()
    expect(spacing[4]).toBe('1rem')
    expect(semanticSpacing.md).toBe('1rem')
  })

  it('should export design tokens - typography', async () => {
    const { fontFamily, fontSize, fontWeight } = await import('@/tokens')
    expect(fontFamily).toBeDefined()
    expect(fontSize).toBeDefined()
    expect(fontWeight).toBeDefined()
    expect(fontFamily.sans).toContain('Inter')
    expect(fontSize.base).toBeDefined()
    expect(fontWeight.normal).toBe('400')
  })

  it('should export cn utility', async () => {
    const { cn } = await import('@/lib/utils')
    expect(cn).toBeDefined()
    expect(typeof cn).toBe('function')
    expect(cn('class-a', 'class-b')).toBe('class-a class-b')
  })

  it('should export Dialog components', async () => {
    const {
      Dialog,
      DialogTrigger,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
    } = await import('@/components/ui/dialog')

    expect(Dialog).toBeDefined()
    expect(DialogTrigger).toBeDefined()
    expect(DialogContent).toBeDefined()
    expect(DialogHeader).toBeDefined()
    expect(DialogTitle).toBeDefined()
    expect(DialogDescription).toBeDefined()
  })

  it('should export Card components', async () => {
    const {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
    } = await import('@/components/ui/card')

    expect(Card).toBeDefined()
    expect(CardHeader).toBeDefined()
    expect(CardTitle).toBeDefined()
    expect(CardDescription).toBeDefined()
    expect(CardContent).toBeDefined()
    expect(CardFooter).toBeDefined()
  })

  it('should export Toast utilities', async () => {
    const { useToast, toast } = await import('@/components/ui/toast')
    expect(useToast).toBeDefined()
    expect(toast).toBeDefined()
    expect(typeof useToast).toBe('function')
  })
})
