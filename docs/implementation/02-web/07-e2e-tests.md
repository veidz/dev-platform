# E2E Tests - Playwright

## Contexto

Testes end-to-end dos fluxos críticos da aplicação.

## Dependências

- Phase 2 (01-06) completo

## Checkboxes

### Estrutura

- [ ] `tests/e2e/auth/login.test.ts`
- [ ] `tests/e2e/auth/register.test.ts`
- [ ] `tests/e2e/apis/create-api.test.ts`
- [ ] `tests/e2e/apis/create-endpoint.test.ts`
- [ ] `tests/e2e/playground/send-request.test.ts`
- [ ] `tests/e2e/workspace/invite-member.test.ts`

### Fixtures

- [ ] `tests/e2e/fixtures/auth.fixture.ts` (authenticated user)
- [ ] `tests/e2e/fixtures/workspace.fixture.ts` (test workspace)

### Page Objects

- [ ] `tests/e2e/pages/LoginPage.ts`
- [ ] `tests/e2e/pages/DashboardPage.ts`
- [ ] `tests/e2e/pages/ApisPage.ts`
- [ ] `tests/e2e/pages/PlaygroundPage.ts`

### Test: Auth Flow

- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Register novo usuário
- [ ] Logout

### Test: API Management

- [ ] Criar nova API
- [ ] Editar API
- [ ] Adicionar endpoint
- [ ] Deletar API

### Test: Playground

- [ ] Criar collection
- [ ] Adicionar request
- [ ] Enviar request GET
- [ ] Enviar request POST
- [ ] Salvar response

### Test: Workspace

- [ ] Trocar workspace
- [ ] Convidar membro
- [ ] Atualizar settings

### CI Integration

- [ ] Configurar Playwright no GitHub Actions
- [ ] Screenshots on failure
- [ ] Video recording
- [ ] Parallel execution

### Validação

- [ ] Todos testes passam localmente
- [ ] Testes passam no CI
- [ ] Coverage dos fluxos críticos

## Arquivos Criados

```
tests/e2e/
├── auth/
│   ├── login.test.ts
│   └── register.test.ts
├── apis/
│   ├── create-api.test.ts
│   └── create-endpoint.test.ts
├── playground/
│   └── send-request.test.ts
├── workspace/
│   └── invite-member.test.ts
├── fixtures/
│   ├── auth.fixture.ts
│   └── workspace.fixture.ts
└── pages/
    ├── LoginPage.ts
    ├── DashboardPage.ts
    ├── ApisPage.ts
    └── PlaygroundPage.ts
```

## Exemplo: LoginPage.ts

```typescript
import { Page } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email)
    await this.page.fill('[name="password"]', password)
    await this.page.click('button[type="submit"]')
  }

  async expectError(message: string) {
    await this.page.waitForSelector(`text=${message}`)
  }
}
```

## Exemplo: auth.test.ts

```typescript
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login('user@test.com', 'password123')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('shows error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login('user@test.com', 'wrongpass')

    await loginPage.expectError('Credenciais inválidas')
  })
})
```

## Recursos

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)

## Próximo Passo

✅ **Phase 2 completo!**

→ [Phase 3: Backend](../03-backend/01-api-gateway/01-setup.md)
