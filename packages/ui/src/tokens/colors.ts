const colors = {
  background: 'hsl(222.2 84% 4.9%)',
  foreground: 'hsl(210 40% 98%)',

  card: 'hsl(222.2 84% 4.9%)',
  cardForeground: 'hsl(210 40% 98%)',

  popover: 'hsl(222.2 84% 4.9%)',
  popoverForeground: 'hsl(210 40% 98%)',

  primary: 'hsl(217.2 91% 60%)',
  primaryForeground: 'hsl(222.2 84% 4.9%)',

  secondary: 'hsl(217.2 32.6% 17.5%)',
  secondaryForeground: 'hsl(210 40% 98%)',

  muted: 'hsl(217.2 32.6% 17.5%)',
  mutedForeground: 'hsl(215 20.2% 65.1%)',

  accent: 'hsl(217.2 91% 60%)',
  accentForeground: 'hsl(222.2 84% 4.9%)',

  destructive: 'hsl(0 62.8% 50%)',
  destructiveForeground: 'hsl(210 40% 98%)',

  border: 'hsl(217.2 32.6% 17.5%)',
  input: 'hsl(217.2 32.6% 17.5%)',
  ring: 'hsl(217.2 91% 60%)',
} as const

const rawColors = {
  background: '222.2 84% 4.9%',
  foreground: '210 40% 98%',
  border: '217.2 32.6% 17.5%',
} as const

export type ColorToken = keyof typeof colors
export type RawColorToken = keyof typeof rawColors

export { colors, rawColors }
