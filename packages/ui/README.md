# @dev-platform/ui

Sistema de design unificado para a plataforma Dev Platform, construído com React 19, TypeScript e Tailwind CSS v4.

## 🎨 Características

- **Design Tokens** - Sistema de cores HSL, espaçamentos e tipografia reutilizáveis
- **Componentes Acessíveis** - 100% testados com jest-axe para conformidade WCAG
- **Type-Safe** - TypeScript com tipos explícitos em todos os componentes
- **Testado** - Cobertura 100% em testes unitários e de acessibilidade
- **Storybook** - Documentação interativa de componentes
- **Tailwind CSS v4** - Sistema de utilidades moderno

## 📦 Instalação

```bash
pnpm add @dev-platform/ui
```

### Peer Dependencies

```bash
pnpm add react@^19.2.0 react-dom@^19.2.0
```

## 🚀 Uso Rápido

### Importar Componentes

```tsx
import { Button, Input, Label } from '@dev-platform/ui'

function App() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Input type="email" placeholder="Email" />
      <Label htmlFor="name">Name</Label>
    </div>
  )
}
```

### Importar Design Tokens

```tsx
import { colors, spacing, fontSize } from '@dev-platform/ui/tokens'

const CustomComponent = () => (
  <div
    style={{
      color: colors.primary,
      padding: spacing[4],
      fontSize: fontSize.lg,
    }}
  >
    Custom styled component
  </div>
)
```

### Importar Estilos Globais

```tsx
// No seu arquivo de entrada (main.tsx ou _app.tsx)
import '@dev-platform/ui/styles'
```

## 🎨 Design Tokens

### Cores

Sistema de cores HSL otimizado para dark theme:

```tsx
import { colors, rawColors } from '@dev-platform/ui/tokens'

// Uso direto
<div style={{ backgroundColor: colors.primary }}>

// Para uso com CSS variables
<div style={{ backgroundColor: `hsl(${rawColors.primary})` }}>
```

**Cores disponíveis:**

- `background`, `foreground`
- `primary`, `primaryForeground`
- `secondary`, `secondaryForeground`
- `muted`, `mutedForeground`
- `accent`, `accentForeground`
- `destructive`, `destructiveForeground`
- `card`, `cardForeground`
- `popover`, `popoverForeground`
- `border`, `input`, `ring`

### Espaçamentos

Escala baseada em 4px (0.25rem):

```tsx
import { spacing, semanticSpacing } from '@dev-platform/ui/tokens'

// Escala numérica (0 a 96)
<div style={{ padding: spacing[4] }}> // 16px

// Espaçamentos semânticos
<div style={{ gap: semanticSpacing.md }}> // 16px
```

**Escala semântica:**

- `xs`: 8px (0.5rem)
- `sm`: 12px (0.75rem)
- `md`: 16px (1rem)
- `lg`: 24px (1.5rem)
- `xl`: 32px (2rem)
- `2xl`: 48px (3rem)
- `3xl`: 64px (4rem)
- `4xl`: 96px (6rem)

### Tipografia

```tsx
import { fontFamily, fontSize, fontWeight } from '@dev-platform/ui/tokens'
;<h1
  style={{
    fontFamily: fontFamily.sans,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
  }}
>
  Título
</h1>
```

**Famílias de fonte:**

- `sans`: Inter (text)
- `mono`: JetBrains Mono (code)

**Tamanhos:** `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

**Pesos:** `300`, `400`, `500`, `600`, `700`, `800`

## 🧩 Componentes

### Button

Botão com múltiplas variantes e tamanhos:

```tsx
import { Button } from '@dev-platform/ui'

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

**Props:**

- `variant`: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
- `size`: `default` | `sm` | `lg` | `icon`
- `asChild`: boolean - Renderiza como filho (Radix pattern)
- Todos os props nativos de `<button>`

### Input

Campo de entrada acessível:

```tsx
import { Input } from '@dev-platform/ui'

<Input type="text" placeholder="Nome" />
<Input type="email" placeholder="email@exemplo.com" />
<Input type="password" placeholder="Senha" />
<Input disabled placeholder="Desabilitado" />
```

**Props:**

- `type`: todos os tipos HTML5 (text, email, password, number, tel, search, etc.)
- Todos os props nativos de `<input>`

### Label

Label acessível com associação automática:

```tsx
import { Label, Input } from '@dev-platform/ui'
;<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

### Card

Contêiner com borda e padding:

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@dev-platform/ui'
;<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo principal</CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### Dialog

Modal acessível com overlay:

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@dev-platform/ui'
;<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirmar ação</DialogTitle>
      <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button variant="destructive">Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu

Menu suspenso com suporte a ícones e atalhos:

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@dev-platform/ui'
;<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Perfil</DropdownMenuItem>
    <DropdownMenuItem>Configurações</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Sair</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Form

Formulários validados com React Hook Form:

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl } from '@dev-platform/ui'
import { useForm } from 'react-hook-form'

const form = useForm()

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="username" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <Button type="submit">Enviar</Button>
  </form>
</Form>
```

### Table

Tabela com estilos consistentes:

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@dev-platform/ui'
;<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>João Silva</TableCell>
      <TableCell>joao@exemplo.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### DataTable

Tabela com sorting, filtering e paginação:

```tsx
import { DataTable } from '@dev-platform/ui'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
]

<DataTable columns={columns} data={users} />
```

### Toast

Notificações temporárias:

```tsx
import { useToast, Toaster } from '@dev-platform/ui'

function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  )
}

function YourComponent() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: 'Sucesso!',
          description: 'Sua ação foi concluída.',
        })
      }}
    >
      Mostrar Toast
    </Button>
  )
}
```

### Chart

Gráficos com Recharts:

```tsx
import { ChartContainer, ChartTooltip } from '@dev-platform/ui'
import { LineChart, Line } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
]

<ChartContainer config={chartConfig}>
  <LineChart data={data}>
    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
    <ChartTooltip />
  </LineChart>
</ChartContainer>
```

### CodeEditor

Editor de código com syntax highlighting:

```tsx
import { CodeEditor } from '@dev-platform/ui'
;<CodeEditor
  value={code}
  onChange={setCode}
  language="typescript"
  theme="vs-dark"
/>
```

## 🧪 Testes

Este package possui cobertura de 100% nos componentes principais:

```bash
# Executar todos os testes
pnpm test

# Testes com coverage
pnpm test:cov

# Testes em modo watch
pnpm test:watch
```

### Testes Inclusos

- **Unit Tests**: Button (24 testes), Input (29 testes)
- **Accessibility Tests**: Button (5 testes), Form (5 testes), Dialog (4 testes)
- **Total**: 66 testes passando

## 📚 Storybook

Explore todos os componentes interativamente:

```bash
pnpm storybook
```

Acesse: http://localhost:6007

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
pnpm dev

# Build para produção
pnpm build

# Executar testes
pnpm test

# Lint
pnpm lint

# Formatar código
pnpm format

# Verificar formatação
pnpm format:check

# Type checking
pnpm typecheck

# Storybook
pnpm storybook
pnpm build-storybook
```

### Estrutura de Arquivos

```
src/
├── components/
│   └── ui/
│       ├── button/
│       │   ├── button.tsx
│       │   ├── button.stories.tsx
│       │   └── index.ts
│       ├── input/
│       └── ...
├── tokens/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── index.ts
├── lib/
│   └── utils.ts
├── styles/
│   └── globals.css
└── index.ts

tests/
├── unit/
│   └── ui/
│       ├── button.test.tsx
│       └── input.test.tsx
├── a11y/
│   ├── button.a11y.test.tsx
│   ├── form.a11y.test.tsx
│   └── dialog.a11y.test.tsx
├── setup.ts
└── global.d.ts
```

## 🎯 Boas Práticas

### Acessibilidade

Todos os componentes seguem as diretrizes WCAG 2.1 Level AA:

- Labels associados corretamente
- ARIA attributes apropriados
- Navegação por teclado
- Focus management
- Screen reader support

### Type Safety

```tsx
// ✅ BOM - Tipos explícitos
import type { ButtonProps } from '@dev-platform/ui'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}

// ❌ EVITAR - any
const MyButton = (props: any) => { ... }
```

### Composição de Estilos

```tsx
import { cn } from '@dev-platform/ui/lib/utils'
;<Button className={cn('custom-class', isActive && 'active-class')}>
  Button
</Button>
```
