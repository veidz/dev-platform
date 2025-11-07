# Auth Pages - Login, Register, Forgot Password

## Contexto

Páginas de autenticação com validação, error handling e integração com SDK.

## Dependências

- 01-setup.md completo

## Checkboxes

### Pesquisa

- [ ] Docs react-hook-form (https://react-hook-form.com)
- [ ] Next.js authentication patterns

### Estrutura de Rotas

- [ ] Criar `src/app/(auth)/login/page.tsx`
- [ ] Criar `src/app/(auth)/register/page.tsx`
- [ ] Criar `src/app/(auth)/forgot-password/page.tsx`
- [ ] Criar `src/app/(auth)/layout.tsx` (layout centralizado)

### Componentes - Login Form

- [ ] Criar `src/components/auth/LoginForm.tsx`
- [ ] React Hook Form com Zod schema
- [ ] Email e password inputs
- [ ] Submit handler com SDK
- [ ] Loading state

### Componentes - Register Form

- [ ] Criar `src/components/auth/RegisterForm.tsx`
- [ ] Campos: name, email, password, confirmPassword
- [ ] Validação de senha forte
- [ ] Error display

### Componentes - Forgot Password

- [ ] Criar `src/components/auth/ForgotPasswordForm.tsx`
- [ ] Campo email
- [ ] Success message após submit

### Error Handling

- [ ] Display errors do servidor
- [ ] Toast notifications
- [ ] Field-level errors

### Redirects

- [ ] Login → redirect para /dashboard
- [ ] Register → redirect para /dashboard
- [ ] Já autenticado → redirect para /dashboard

### OAuth Buttons (Opcional)

- [ ] Google login button
- [ ] GitHub login button
- [ ] Handler de callback

### Hooks - useLogin

- [ ] Criar `src/hooks/auth/useLogin.ts`
- [ ] React Query mutation
- [ ] Atualizar auth store

### Hooks - useRegister

- [ ] Criar `src/hooks/auth/useRegister.ts`
- [ ] React Query mutation

### Testes

- [ ] `tests/unit/web/auth/LoginForm.test.tsx`
- [ ] `tests/unit/web/auth/RegisterForm.test.tsx`
- [ ] Simular submit
- [ ] Testar validações

### Validação

- [ ] Login funciona
- [ ] Register funciona
- [ ] Forgot password envia email
- [ ] Redirects corretos
- [ ] `pnpm test` (100% coverage)

## Arquivos Criados

```
src/
├── app/(auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── layout.tsx
├── components/auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ForgotPasswordForm.tsx
└── hooks/auth/
    ├── useLogin.ts
    └── useRegister.ts
```

## Exemplo: LoginForm.tsx

```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginDto } from "@dev-platform/shared"
import { Button, Input } from "@dev-platform/ui"
import { useLogin } from "@/hooks/auth/useLogin"

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate: login, isPending } = useLogin()

  const onSubmit = (data: LoginDto) => login(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("email")}
        type="email"
        label="Email"
        error={errors.email?.message}
      />
      <Input
        {...register("password")}
        type="password"
        label="Senha"
        error={errors.password?.message}
      />
      <Button type="submit" loading={isPending} className="w-full">
        Entrar
      </Button>
    </form>
  )
}
```

## Recursos

- [React Hook Form](https://react-hook-form.com)
- [Next.js Auth Patterns](https://nextjs.org/docs/app/building-your-application/authentication)

## Próximo Passo

→ [03-workspace.md](./03-workspace.md)
