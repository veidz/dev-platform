# API Gateway - Auth Module

## Contexto

Autenticação JWT, OAuth e RBAC.

## Dependências

- 01-setup.md completo

## Checkboxes

### Pesquisa

- [ ] Docs @nestjs/passport (https://docs.nestjs.com/security/authentication)
- [ ] Docs @nestjs/jwt
- [ ] Verificar versões npm

### Dependencies

- [ ] `pnpm add @nestjs/passport@latest`
- [ ] `pnpm add @nestjs/jwt@latest`
- [ ] `pnpm add passport@latest`
- [ ] `pnpm add passport-jwt@latest`
- [ ] `pnpm add passport-google-oauth20@latest`
- [ ] `pnpm add passport-github2@latest`
- [ ] `pnpm add bcrypt@latest`
- [ ] `pnpm add -D @types/passport-jwt@latest`
- [ ] `pnpm add -D @types/bcrypt@latest`

### Auth Module Structure

- [ ] Criar `src/auth/auth.module.ts`
- [ ] Criar `src/auth/auth.service.ts`
- [ ] Criar `src/auth/auth.controller.ts`
- [ ] Criar `src/auth/auth.types.ts`

### Auth Service

- [ ] Method `validateUser(email, password)` com bcrypt
- [ ] Method `login(user)` retorna tokens
- [ ] Method `register(dto)` cria user + hash password
- [ ] Method `refreshToken(refreshToken)` valida + gera novo
- [ ] Method `logout(userId)` blacklist token no Redis

### JWT Strategy

- [ ] Criar `src/auth/strategies/jwt.strategy.ts`
- [ ] Extend PassportStrategy(Strategy, 'jwt')
- [ ] Extract token from Authorization header
- [ ] Validate payload (check expiration, user exists)
- [ ] Return user object

### JWT Module Config

- [ ] Configurar JwtModule.register()
- [ ] secret: process.env.JWT_SECRET
- [ ] signOptions: { expiresIn: '15m' }
- [ ] Refresh token: expiresIn: '7d'

### Guards

- [ ] Criar `src/auth/guards/jwt-auth.guard.ts`
- [ ] Extend AuthGuard('jwt')
- [ ] Criar `src/auth/guards/roles.guard.ts`
- [ ] Check user.role against required roles
- [ ] Throw ForbiddenException se não autorizado

### Decorators

- [ ] Criar `src/auth/decorators/roles.decorator.ts`
- [ ] SetMetadata('roles', [...roles])
- [ ] Criar `src/auth/decorators/current-user.decorator.ts`
- [ ] createParamDecorator para extrair user do request

### Google OAuth Strategy

- [ ] Criar `src/auth/strategies/google.strategy.ts`
- [ ] Extend PassportStrategy(Strategy, 'google')
- [ ] clientID, clientSecret, callbackURL
- [ ] Validate method: find or create user

### GitHub OAuth Strategy

- [ ] Criar `src/auth/strategies/github.strategy.ts`
- [ ] Similar ao Google
- [ ] Handle GitHub profile

### Auth Controller - Endpoints

- [ ] POST /auth/login (email, password)
- [ ] POST /auth/register (name, email, password)
- [ ] POST /auth/refresh (refreshToken)
- [ ] POST /auth/logout (@CurrentUser)
- [ ] GET /auth/google (redirect)
- [ ] GET /auth/google/callback
- [ ] GET /auth/github (redirect)
- [ ] GET /auth/github/callback

### DTOs Validation

- [ ] Criar `src/auth/dto/login.dto.ts` com Zod/class-validator
- [ ] Criar `src/auth/dto/register.dto.ts`
- [ ] Email format validation
- [ ] Password strength (min 12 chars)

### Token Blacklist (Redis)

- [ ] Criar método para adicionar token blacklist
- [ ] TTL igual ao expiration do token
- [ ] Check blacklist no JWT strategy

### Error Handling

- [ ] UnauthorizedException para credenciais inválidas
- [ ] ConflictException para email já existente
- [ ] Custom error messages

### Testes Unitários

- [ ] `tests/unit/api-gateway/auth/auth.service.test.ts`
- [ ] Test validateUser (valid/invalid)
- [ ] Test login returns tokens
- [ ] Test register hashes password
- [ ] Test refreshToken
- [ ] Mock Prisma/Redis

### Testes Integração

- [ ] `tests/integration/api-gateway/auth/auth.controller.test.ts`
- [ ] POST /auth/login (200 com tokens)
- [ ] POST /auth/login (401 credenciais inválidas)
- [ ] POST /auth/register (201 + tokens)
- [ ] POST /auth/register (409 email exists)
- [ ] POST /auth/refresh (200 novo token)
- [ ] POST /auth/logout (200)

### Testes Guards

- [ ] Proteger rota com @UseGuards(JwtAuthGuard)
- [ ] Request sem token → 401
- [ ] Request com token válido → 200
- [ ] Test roles guard (admin only route)

### Documentação

- [ ] Atualizar README com fluxo de auth
- [ ] Documentar environment variables necessárias
- [ ] Exemplos de uso dos decorators

### Validação

- [ ] `pnpm dev` (app inicia)
- [ ] Testar login via Postman/curl
- [ ] Testar protected route
- [ ] `pnpm test` (100% coverage)
- [ ] `pnpm lint` (zero erros)

## Arquivos Criados

```
src/auth/
├── auth.module.ts
├── auth.service.ts
├── auth.controller.ts
├── auth.types.ts
├── strategies/
│   ├── jwt.strategy.ts
│   ├── google.strategy.ts
│   └── github.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── decorators/
│   ├── roles.decorator.ts
│   └── current-user.decorator.ts
└── dto/
    ├── login.dto.ts
    └── register.dto.ts

tests/
├── unit/api-gateway/auth/
│   └── auth.service.test.ts
└── integration/api-gateway/auth/
    └── auth.controller.test.ts
```

## Exemplo: jwt.strategy.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import type { JwtPayload } from '@dev-platform/shared'
import { PrismaService } from '@/shared/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user) {
      throw new UnauthorizedException('Token inválido')
    }

    return user
  }
}
```

## Recursos

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

## Próximo Passo

→ [03-rate-limiting.md](./03-rate-limiting.md)
