# ADR-008: Autenticação e Autorização

## Contexto

Plataforma requer: autenticação de usuários (email/senha, OAuth), multi-tenancy baseado em workspace, permissões baseadas em roles (Owner, Admin, Dev, Viewer), autenticação via API key para acesso programático e gerenciamento de sessões entre microsserviços.

Requisitos de segurança: conformidade OWASP, refresh de token sem re-autenticação, rate limiting por usuário/API key e audit logging.

## Decisão

**Autenticação baseada em JWT** com refresh tokens e modelo de autorização **RBAC**.

### Justificativa Técnica

**Fluxo de Autenticação:**

1. **Login:** Usuário fornece credenciais → Backend valida → Retorna access token (15min) + refresh token (7 dias)
2. **Request:** Cliente envia access token em header Authorization
3. **Validação:** API Gateway valida assinatura JWT, verifica expiração
4. **Refresh:** Antes de expirar, troca refresh token por novo access token
5. **Logout:** Invalida refresh token (blacklist em Redis)

**Estrutura JWT:**

```typescript
{
  sub: userId,           // Subject
  wid: workspaceId,      // Contexto workspace
  role: 'Dev',     // Role do usuário no workspace
  iat: 1234567890,       // Issued at
  exp: 1234568790        // Expiration (15min)
}
```

**Implementação NestJS:**

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'owner')
@Delete('api/:id')
async deleteApi(@Param('id') id: string) { }
```

**Autenticação API Key:**
Fluxo separado para acesso programático:

- Hash com bcrypt, armazenado em database
- Scoped para workspace e permissions
- Rate limiting por key (configurável)
- Datas de expiração e revogação

**Modelo RBAC:**

```typescript
enum Permission {
  READ_API = "api:read",
  WRITE_API = "api:write",
  DELETE_API = "api:delete",
  MANAGE_USERS = "users:manage",
}

const roles = {
  viewer: [Permission.READ_API],
  Dev: [Permission.READ_API, Permission.WRITE_API],
  admin: [...DevPermissions, Permission.DELETE_API],
  owner: [...adminPermissions, Permission.MANAGE_USERS],
}
```

**Integração OAuth:**
Suporte Google e GitHub via Passport.js:

```typescript
@Get('auth/google')
@UseGuards(AuthGuard('google'))
googleAuth() { }

@Get('auth/google/callback')
@UseGuards(AuthGuard('google'))
googleAuthRedirect(@Req() req) {
  return this.authService.handleOAuthCallback(req.user);
}
```

### Medidas de Segurança

**Segurança de Tokens:**

- Access tokens: Short-lived (15min) para minimizar exposição
- Refresh tokens: Cookies httpOnly armazenados (prevenção XSS)
- Rotação de tokens: Novo refresh token a cada refresh
- Blacklisting: Tokens revogados armazenados em Redis com TTL

**Segurança de Senha:**

- bcrypt com cost factor 12
- Requisitos de senha: 12+ caracteres, regras de complexidade
- Rate limiting em tentativas de login (5 por 15min por IP)
- Bloqueio de conta após tentativas falhadas

**Proteção CSRF:**

- Atributo SameSite em cookies
- Tokens CSRF para operações que mudam estado
- Validação de header Origin/Referer

**2FA (Opcional):**
Autenticação two-factor baseada em TOTP via apps authenticator.

### Alternativas Consideradas

**Auth Baseado em Sessão:** Stateful, requer session store distribuído. JWT stateless, melhor para microsserviços.

**OAuth-Only:** Força usuários a ter conta Google/GitHub. Email/senha fornece flexibilidade.

**NextAuth.js:** Excelente para Next.js mas fortemente acoplado. Auth backend desacoplado preferido para microsserviços.

## Consequências

### Positivas

**Stateless:** Validação JWT não requer lookup em database (performance).

**Escalabilidade:** Sem gargalo de session store. Scaling horizontal direto.

**Microservices-Friendly:** Cada serviço valida JWT independentemente.

**Experiência do Desenvolvedor:** Bibliotecas JWT padrão disponíveis em todas linguagens.

### Negativas

**Revogação de Token:** Revogar access token antes da expiração requer blacklist (adiciona latência).

**Tamanho de Token:** Payload JWT maior que session ID (~200 bytes vs 16 bytes).

**Armazenamento Refresh Token:** Deve persistir refresh tokens (database ou Redis).

**Rotação de Chave:** Mudar secret JWT requer re-autenticação de todos usuários.

### Mitigação

**TTL Curto Access Token:** 15min limita dano de tokens vazados.

**Monitoramento:** Rastrear tentativas de login falhadas, padrões de acesso incomuns.

**Gerenciamento de Secrets:** Armazenar secret JWT em variáveis de ambiente, rodar periodicamente.

**Rate Limiting:** Implementar limites por usuário, por IP e por API key.

## Referências

- [Best Practices JWT](https://datatracker.ietf.org/doc/html/rfc8725)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js Strategies](http://www.passportjs.org/packages/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749)
