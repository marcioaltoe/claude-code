# Análise Comparativa: Frontend Architecture

**Objetivo**: Comparar as melhores práticas da indústria com nossas estruturas atuais (Janus e GSS) para definir um modelo consolidado.

---

## 1. Estrutura Atual vs Recomendações

### 1.1 Janus (Monorepo Turborepo)

**Estrutura Atual**:

```
janus/
├── apps/
│   ├── accessus/           # App independente
│   └── orbis/              # App independente
│       └── src/
│           ├── app/
│           ├── core/
│           │   ├── entities/
│           │   ├── models/
│           │   └── usecases/
│           ├── features/
│           │   └── dashboard/
│           │       ├── components/
│           │       ├── hooks/
│           │       ├── services/
│           │       ├── stores/
│           │       └── types/
│           ├── routes/
│           ├── services/
│           └── shared/
└── packages/
    ├── domain/             # Shared domain logic
    ├── ui/                 # Shared UI components
    └── [outros]
```

**Pontos Fortes**:
✅ Estrutura `apps/` e `packages/` (alinhada com best practices)
✅ Monorepo com Turborepo (caching e task orchestration)
✅ Shared code em `packages/`
✅ Feature-based structure dentro de apps

**Pontos de Melhoria**:
⚠️ Estrutura dentro de `apps/orbis/src/core/` poderia seguir Clean Architecture mais claramente
⚠️ Falta padronização de layers dentro de features
⚠️ Não está claro se usa TanStack Store ou outro state manager

---

### 1.2 GSS Front (App Standalone)

**Estrutura Atual**:

```
apps/front/src/
├── core/                   # Shared infrastructure
│   ├── domain/
│   │   └── entities/
│   └── application/
│       └── ports/
├── infrastructure/         # Core implementations
│   ├── http/
│   ├── storage/
│   ├── events/
│   └── query/
├── features/               # Feature modules
│   └── auth/
│       ├── domain/
│       │   └── entities/
│       ├── application/
│       │   ├── ports/
│       │   └── use-cases/
│       ├── infrastructure/
│       │   ├── gateways/
│       │   ├── schemas/
│       │   └── services/
│       └── presentation/
│           ├── components/
│           ├── hooks/
│           ├── pages/
│           └── stores/
├── routes/
└── shared/
```

**Pontos Fortes**:
✅ Clean Architecture muito clara (Domain → Application → Infrastructure → Presentation)
✅ Feature-based com todas as layers
✅ Gateway/Port pattern bem definido
✅ Use cases explícitos
✅ TanStack Store com factory pattern
✅ Separação clara de concerns

**Pontos de Melhoria**:
⚠️ Estrutura standalone (não está em monorepo)
⚠️ Código não compartilhado com outros apps
⚠️ Poderia se beneficiar de packages/ para UI, utils, domain compartilhados

---

### 1.3 Recomendações da Indústria

**Segundo a pesquisa (Nx, pnpm, Turborepo)**:

1. **Estrutura de Monorepo**:

```
/(project-root)
├── apps/
│   └── web/              # React + Vite + TanStack Router
│   └── mobile/           # React Native (opcional)
├── packages/
│   └── ui/               # Shared UI components
│   └── utils/            # Shared utility functions/hooks
│   └── config/           # Shared configs (lint/ts/prettier)
│   └── domain/           # Shared domain logic
├── package.json
├── pnpm-workspace.yaml   # ou turbo.json
```

2. **Princípios**:

- ✅ Group by domain, not by type
- ✅ Isolation of concerns (apps vs packages)
- ✅ Consistent dependency management
- ✅ Single source of truth para código compartilhado
- ✅ Strict dependency boundaries (apps não importam de apps)

3. **Ferramentas**:

- ✅ pnpm Workspaces ou Bun Workspaces
- ✅ Turborepo para task orchestration e caching
- ✅ TypeScript project references
- ✅ Vite para build rápido

---

## 2. Análise Comparativa

| Aspecto                 | Janus (Atual)                                 | GSS Front (Atual)                                            | Recomendação Indústria             | Proposta                                  |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------------ | ---------------------------------- | ----------------------------------------- |
| **Estrutura**           | Monorepo (apps + packages)                    | Standalone app                                               | Monorepo (apps + packages)         | ✅ Monorepo                               |
| **Apps**                | apps/accessus, apps/orbis                     | apps/front (standalone)                                      | apps/web, apps/mobile              | apps/web, apps/admin, apps/mobile         |
| **Packages**            | packages/domain, packages/ui                  | Não tem                                                      | packages/ui, utils, config, domain | ✅ Sim                                    |
| **Feature Structure**   | Parcial (components, hooks, services, stores) | Completa (domain, application, infrastructure, presentation) | Group by domain                    | **Clean Architecture dentro de features** |
| **Core Infrastructure** | core/entities, core/usecases                  | core/domain, core/application + infrastructure/              | Shared em packages/                | **core/ + infrastructure/ no app**        |
| **State Management**    | Não identificado claramente                   | TanStack Store com factory                                   | Context ou TanStack Store          | ✅ TanStack Store                         |
| **Use Cases**           | core/usecases/                                | features/\*/application/use-cases/                           | Depende da complexidade            | **Thin use cases dentro de features**     |
| **Gateways**            | services/                                     | features/\*/infrastructure/gateways/                         | Adapters/Gateways                  | ✅ Gateway pattern                        |
| **Shared Code**         | packages/domain, packages/ui                  | Não compartilha                                              | packages/\*                        | ✅ packages/ui, domain, utils             |
| **Build Tool**          | Turborepo                                     | Vite                                                         | Turborepo/Nx + Vite                | ✅ Turborepo + Vite                       |
| **Dependency Mgmt**     | pnpm ou yarn                                  | npm/pnpm                                                     | pnpm workspaces                    | ✅ Bun workspaces (ou pnpm)               |

---

## 3. Proposta de Modelo Consolidado

### 3.1 Estrutura de Monorepo (Recomendada)

```
/(project-root - ex: janus)
├── apps/
│   ├── web/                      # Frontend principal (ex: Orbis)
│   │   └── src/
│   │       ├── app/              # App setup (router, providers)
│   │       ├── core/             # Core app infrastructure
│   │       │   ├── domain/
│   │       │   │   └── entities/      # App-specific entities
│   │       │   └── application/
│   │       │       └── ports/         # Core interfaces (HttpGateway, etc.)
│   │       ├── infrastructure/   # Core implementations
│   │       │   ├── http/              # HTTP service
│   │       │   ├── storage/           # Cookie/localStorage
│   │       │   ├── events/            # Event emitter
│   │       │   └── query/             # TanStack Query setup
│   │       ├── features/         # Feature modules (Clean Architecture)
│   │       │   └── auth/
│   │       │       ├── domain/
│   │       │       │   └── entities/
│   │       │       ├── application/
│   │       │       │   ├── ports/           # AuthGateway
│   │       │       │   └── use-cases/       # LoginUseCase (thin)
│   │       │       ├── infrastructure/
│   │       │       │   ├── gateways/        # AuthHttpGateway
│   │       │       │   └── schemas/         # Zod schemas
│   │       │       └── presentation/
│   │       │           ├── components/
│   │       │           ├── hooks/
│   │       │           ├── pages/
│   │       │           └── stores/          # TanStack Store
│   │       ├── routes/           # TanStack Router routes
│   │       └── shared/           # App-specific shared code
│   │
│   ├── admin/                    # Outro app (ex: Accessus)
│   │   └── src/
│   │       └── [mesma estrutura]
│   │
│   └── mobile/                   # App mobile (React Native)
│       └── src/
│           └── [estrutura adaptada]
│
├── packages/
│   ├── ui/                       # Shared UI components (shadcn/ui)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── index.ts    # barrel export
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                    # Shared utilities
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── string.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── domain/                   # Shared domain logic
│   │   ├── src/
│   │   │   ├── value-objects/
│   │   │   │   ├── email.ts
│   │   │   │   ├── uuid.ts
│   │   │   │   └── index.ts
│   │   │   ├── result.ts         # Result type
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                   # Shared configs
│   │   ├── eslint-config/
│   │   │   └── index.js
│   │   ├── typescript-config/
│   │   │   ├── base.json
│   │   │   ├── react.json
│   │   │   └── node.json
│   │   └── tailwind-config/
│   │       └── index.js
│   │
│   └── types/                    # Shared TypeScript types
│       ├── src/
│       │   ├── api.ts
│       │   └── index.ts
│       └── package.json
│
├── package.json                  # Root package.json
├── bun.lockb                     # ou pnpm-lock.yaml
├── turbo.json                    # Turborepo config
├── tsconfig.json                 # Root TypeScript config
└── README.md
```

---

### 3.2 Dependency Management

**Recomendação**: Usar **Bun Workspaces** (preferência) ou **pnpm Workspaces**

**`package.json` (root)**:

```json
{
  "name": "janus-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

**`turbo.json`**:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

---

### 3.3 TypeScript Project References

**`tsconfig.json` (root)**:

```json
{
  "files": [],
  "references": [
    { "path": "./apps/web" },
    { "path": "./apps/admin" },
    { "path": "./packages/ui" },
    { "path": "./packages/utils" },
    { "path": "./packages/domain" }
  ]
}
```

**`apps/web/tsconfig.json`**:

```json
{
  "extends": "@repo/typescript-config/react.json",
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/ui": ["../../packages/ui/src"],
      "@repo/utils": ["../../packages/utils/src"],
      "@repo/domain": ["../../packages/domain/src"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/utils" },
    { "path": "../../packages/domain" }
  ]
}
```

---

### 3.4 Package Import Examples

**`packages/ui/package.json`**:

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

**`apps/web/package.json`**:

```json
{
  "name": "web",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*",
    "@repo/domain": "workspace:*",
    "react": "^19.0.0"
  }
}
```

**Uso no código**:

```typescript
// apps/web/src/features/auth/presentation/components/login-form.tsx
import { Button, Input } from "@repo/ui";
import { validateEmail } from "@repo/utils";
import { Email } from "@repo/domain";
```

---

### 3.5 Feature Structure (Clean Architecture)

Dentro de cada app, features seguem Clean Architecture:

```
features/auth/
├── domain/
│   └── entities/              # Domain entities (Session, UserProfile)
├── application/
│   ├── ports/                 # Interfaces (AuthGateway)
│   └── use-cases/             # Thin use cases (LoginUseCase)
├── infrastructure/
│   ├── gateways/              # Implementations (AuthHttpGateway)
│   └── schemas/               # Zod schemas
└── presentation/
    ├── components/            # React components
    ├── hooks/                 # React hooks (useLogin)
    ├── pages/                 # Route pages
    └── stores/                # TanStack Store
```

---

## 4. Comparação de Abordagens

### 4.1 Use Cases: Quando usar?

| Cenário                                  | Recomendação                               |
| ---------------------------------------- | ------------------------------------------ |
| **Simples** (login, logout)              | ✅ Thin use cases (delegate to gateway)    |
| **Complexo** (multi-step, orchestration) | ✅ Use cases with business logic           |
| **Muito simples** (fetch user)           | ⚠️ Pode chamar gateway diretamente do hook |

**Exemplo Simples (Thin)**:

```typescript
// LoginUseCase - thin wrapper
export class LoginUseCase {
  constructor(private readonly gateway: AuthGateway) {}

  async execute(input: LoginInput): Promise<Session> {
    return this.gateway.login(input);
  }
}
```

**Exemplo Complexo (Com Lógica)**:

```typescript
// ProcessOrderUseCase - com orquestração
export class ProcessOrderUseCase {
  constructor(
    private readonly orderGateway: OrderGateway,
    private readonly paymentGateway: PaymentGateway,
    private readonly inventoryGateway: InventoryGateway
  ) {}

  async execute(input: ProcessOrderInput): Promise<Order> {
    // 1. Validar estoque
    const hasStock = await this.inventoryGateway.checkStock(input.items);
    if (!hasStock) throw new Error("Insufficient stock");

    // 2. Processar pagamento
    const payment = await this.paymentGateway.processPayment(input.payment);
    if (!payment.success) throw new Error("Payment failed");

    // 3. Criar pedido
    const order = await this.orderGateway.createOrder({
      ...input,
      paymentId: payment.id,
    });

    // 4. Reservar estoque
    await this.inventoryGateway.reserveStock(input.items);

    return order;
  }
}
```

---

### 4.2 State Management: TanStack Store

**Quando usar TanStack Store**:

- ✅ Local state (UI state, auth session, preferences)
- ✅ State que não vem do servidor
- ✅ State compartilhado entre componentes

**Quando usar TanStack Query**:

- ✅ Server state (fetching, caching, revalidation)
- ✅ Data do backend

**Exemplo**:

```typescript
// TanStack Store para auth session (local)
const authSessionStore = createStore({
  session: null,
  isAuthenticated: false,
});

// TanStack Query para users list (server)
const { data: users } = useQuery({
  queryKey: ["users"],
  queryFn: () => userGateway.fetchAll(),
});
```

---

## 5. Migração e Próximos Passos

### 5.1 Estratégia de Migração

**Opção 1: Mover GSS Front para Janus (Recomendado)**

1. Criar `apps/gss-front/` no Janus
2. Mover estrutura do GSS Front para dentro de `apps/gss-front/src/`
3. Extrair código compartilhado para `packages/`
4. Configurar workspaces e TypeScript references

**Opção 2: Criar Novo Monorepo**

1. Criar novo monorepo zero
2. Mover apps existentes para `apps/`
3. Criar `packages/` do zero com código compartilhado
4. Configurar Turborepo + Bun/pnpm workspaces

### 5.2 Extração de Packages Comuns

**Candidatos para `packages/`**:

1. **@repo/ui**: Componentes shadcn/ui compartilhados (Button, Input, Card, etc.)
2. **@repo/utils**: Funções utilitárias (date, string, validation)
3. **@repo/domain**: Value objects (Email, UUID), Result type
4. **@repo/config**: Configs compartilhadas (ESLint, TypeScript, Tailwind)
5. **@repo/types**: TypeScript types compartilhados (API types)

### 5.3 Benefícios da Nova Estrutura

✅ **Code Sharing**: UI components e utils compartilhados entre apps
✅ **Consistency**: Mesmas configs e padrões em todos os apps
✅ **Type Safety**: TypeScript project references garantem type safety
✅ **Build Speed**: Turborepo caching evita rebuilds desnecessários
✅ **Maintainability**: Clean Architecture clara em cada feature
✅ **Testability**: Use cases e gateways fáceis de mockar
✅ **Scalability**: Adicionar novos apps ou packages é trivial

---

## 6. Modelo Consolidado Final

### Para Apps no Monorepo

```
apps/<app-name>/src/
├── app/                    # App setup
├── core/
│   ├── domain/
│   │   └── entities/      # App-specific core entities
│   └── application/
│       └── ports/         # Core interfaces (HttpGateway, etc.)
├── infrastructure/
│   ├── http/              # HTTP service
│   ├── storage/           # Storage services
│   ├── events/            # Event emitter
│   └── query/             # TanStack Query
├── features/
│   └── <feature>/
│       ├── domain/        # Feature entities
│       ├── application/
│       │   ├── ports/     # Feature gateways
│       │   └── use-cases/ # Thin use cases
│       ├── infrastructure/
│       │   ├── gateways/  # Gateway implementations
│       │   └── schemas/   # Zod schemas
│       └── presentation/
│           ├── components/
│           ├── hooks/
│           ├── pages/
│           └── stores/    # TanStack Store
├── routes/                # TanStack Router
└── shared/                # App-specific shared
```

### Para Packages

```
packages/<package-name>/
├── src/
│   ├── [código compartilhado]
│   └── index.ts          # Barrel export
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Conclusão

**Recomendação Final**:

1. ✅ Usar **estrutura de monorepo** (apps + packages) - alinhado com Janus
2. ✅ Seguir **Clean Architecture dentro de features** - alinhado com GSS
3. ✅ **Thin use cases** que delegam para gateways
4. ✅ **Gateway/Port pattern** para operações externas
5. ✅ **TanStack Store** para local state, **TanStack Query** para server state
6. ✅ **Turborepo** para task orchestration e caching
7. ✅ **Bun workspaces** (ou pnpm) para dependency management
8. ✅ **TypeScript project references** para type safety
9. ✅ Extrair código compartilhado para **packages/** (UI, utils, domain, config)

**O modelo consolida o melhor dos dois mundos**:

- A estrutura de monorepo do Janus (apps + packages)
- A Clean Architecture clara do GSS (domain, application, infrastructure, presentation)
- As melhores práticas da indústria (Nx, Turborepo, pnpm)

Isso nos dá uma arquitetura **simples, testável e manutenível** sem complexidade desnecessária.
