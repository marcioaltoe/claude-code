# Frontend Engineer Skill

**Purpose**: Expert frontend engineering with Clean Architecture, React 19, TanStack ecosystem, and monorepo patterns. Provides implementation examples for building testable, maintainable, scalable frontend applications.

**When to Use**:

- Implementing frontend features and components
- Setting up project structure or monorepo
- Creating use cases and gateways
- Designing state management strategies
- Setting up HTTP communication and routing
- Implementing domain entities and value objects
- Organizing feature modules with Clean Architecture
- Performance optimization and code splitting

---

## Documentation Lookup (MANDATORY)

**ALWAYS use MCP servers for up-to-date documentation:**

- **Context7 MCP**: Use for comprehensive library documentation, API reference, import statements, and version-specific patterns

  - When user asks about TanStack Router, Query, Form, Table, Store APIs
  - For React 19 features and patterns
  - For Vite configuration and build setup
  - To verify correct import paths, hooks usage, and API patterns

- **Perplexity MCP**: Use for architectural research, design patterns, and best practices
  - When researching Clean Architecture implementations in React
  - For state management strategies and trade-offs
  - For performance optimization techniques
  - For folder structure and code organization patterns
  - For troubleshooting complex architectural issues

**Examples of when to use MCP:**

- "How to setup TanStack Router file-based routing?" → Use Context7 MCP for TanStack Router docs
- "What are React 19 use() hook patterns?" → Use Context7 MCP for React docs
- "Best practices for Clean Architecture in React?" → Use Perplexity MCP for research
- "How to configure Vite with React 19?" → Use Context7 MCP for Vite docs

---

## Tech Stack (MANDATORY)

**ALWAYS use these technologies:**

### Core:

- **Runtime**: Bun (NOT npm or pnpm or yarn)
- **Framework**: React 19
- **Build Tool**: Vite 6 with HMR + TanStack Router Plugin
- **Language**: TypeScript (strict mode)

### Routing & Data:

- **Router**: TanStack Router 1.x (file-based, type-safe)
- **Data Fetching**: TanStack Query 5.x
- **State Management**: TanStack Store 0.8.x (local state) + TanStack Query (server state)
- **Forms**: TanStack Form 1.x

### UI & Styling:

- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React

### Validation & HTTP:

- **Validation**: Zod 4.x
- **HTTP Client**: Axios 1.x

### Testing:

- **Unit Tests**: Bun test
- **Component Tests**: React Testing Library + Happy DOM
- **E2E Tests**: Playwright

### Monorepo (Recommended):

- **Package Manager**: Bun Workspaces (ou pnpm Workspaces)
- **Build Orchestration**: Turborepo
- **Structure**: apps/ + packages/

> **📚 Para análise detalhada de monorepo vs standalone, consulte**: `docs/frontend-architecture-comparison.md`

---

## Architecture Overview

Frontend follows **Clean Architecture** with a **feature-based** structure.

### Recommended: Monorepo Structure

```
/(project-root)
├── apps/
│   ├── web/              # Frontend principal
│   │   └── src/
│   │       ├── app/              # App setup
│   │       │   ├── config/      # Environment config
│   │       │   ├── providers/   # React context providers
│   │       │   ├── router.tsx   # Router configuration
│   │       │   └── runtime.tsx  # Runtime setup
│   │       ├── core/
│   │       │   ├── domain/
│   │       │   │   ├── entities/      # Shared domain entities
│   │       │   │   └── value-objects/ # Shared value objects
│   │       │   └── application/
│   │       │       ├── ports/         # Core interfaces
│   │       │       └── use-cases/     # Shared use cases
│   │       ├── infrastructure/        # Core implementations
│   │       │   ├── http/              # HTTP service (Axios wrapper)
│   │       │   ├── storage/           # Cookie/localStorage services
│   │       │   ├── events/            # Event emitter
│   │       │   └── query/             # TanStack Query setup
│   │       ├── features/              # Feature modules (Clean Architecture)
│   │       │   └── auth/
│   │       │       ├── domain/
│   │       │       │   ├── entities/
│   │       │       │   └── value-objects/
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
│   │       ├── routes/                # TanStack Router routes
│   │       │   ├── __root.tsx        # Root layout
│   │       │   ├── index.tsx         # Home page
│   │       │   └── [feature]/        # Feature routes
│   │       └── shared/                # Shared utilities
│   │           ├── components/
│   │           │   ├── ui/           # shadcn/ui components
│   │           │   ├── modules/      # Feature-agnostic modules
│   │           │   └── typography/   # Typography components
│   │           ├── config/           # App-wide configuration
│   │           ├── contexts/         # React contexts
│   │           ├── hooks/            # Shared custom hooks
│   │           ├── lib/              # Utilities and helpers
│   │           └── stores/           # Global stores (TanStack Store)
│   │
│   ├── admin/            # Outro app
│   └── mobile/           # App mobile
│
├── packages/
│   ├── ui/               # Shared UI components (@repo/ui)
│   ├── utils/            # Shared utilities (@repo/utils)
│   ├── domain/           # Shared domain logic (@repo/domain)
│   ├── config/           # Shared configs (@repo/config)
│   └── types/            # Shared types (@repo/types)
│
├── package.json
├── turbo.json
└── tsconfig.json
```

**Benefits**:

- ✅ Code sharing entre apps (UI, utils, domain)
- ✅ Consistent configs e tooling
- ✅ Turborepo caching (faster builds)
- ✅ TypeScript project references (type safety)
- ✅ Single source of truth
- ✅ Scalable for multiple teams

**Use When**:

- Multiple related frontend apps
- Need to share UI components
- Multiple teams working on different apps

---

### Alternative: Standalone App Structure

For single apps without monorepo needs, use the same structure but without `apps/` and `packages/`:

```
src/
├── app/              # App setup
├── core/             # Shared infrastructure
├── infrastructure/   # Core implementations
├── features/         # Feature modules
├── routes/           # TanStack Router
└── shared/           # Shared code
```

**Use When**:

- Single frontend app
- No code sharing needed
- Small team

---

## Clean Architecture Layers (MANDATORY)

**ALWAYS follow this layer structure:**

### 1. Domain Layer (`core/domain` and `features/*/domain`)

Pure business logic with NO external dependencies:

**Example - Entity**:

```typescript
// core/domain/entities/user.entity.ts

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
}

export type UserRole = "admin" | "user" | "guest";
```

**Example - Value Object**:

```typescript
// core/domain/value-objects/email.vo.ts

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new Error("Invalid email format");
    }
    return new Email(value);
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

---

### 2. Application Layer (`core/application` and `features/*/application`)

Use cases and ports (interfaces) - NO implementation details:

**Example - Port (Gateway Interface)**:

```typescript
// features/auth/application/ports/auth.gateway.ts

import type { Session, UserProfile } from "@/features/auth/domain/entities";

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Auth Gateway - Port for authentication operations
 * NO "I" prefix (AuthGateway, not IAuthGateway)
 */
export interface AuthGateway {
  login(input: LoginInput): Promise<Session>;
  signup(input: SignupInput): Promise<boolean>;
  logout(): Promise<void>;
  fetchUserProfile(): Promise<UserProfile>;
  validateToken(): Promise<boolean>;
}
```

**Example - Use Case (Thin Wrapper)**:

```typescript
// features/auth/application/use-cases/login.use-case.ts

import type {
  AuthGateway,
  LoginInput,
} from "@/features/auth/application/ports";
import type { Session } from "@/features/auth/domain/entities";

export class LoginUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute(input: LoginInput): Promise<Session> {
    // Thin wrapper - just delegate to gateway
    return this.authGateway.login(input);
  }
}
```

---

### 3. Infrastructure Layer (`features/*/infrastructure` and `infrastructure/`)

Adapters, gateways, and external service implementations:

**Example - Core HTTP Service**:

```typescript
// infrastructure/http/http.service.ts

import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { toast } from "sonner";

import { authEventEmitter } from "@/infrastructure/events";
import { cookieService } from "@/infrastructure/storage";
import { env } from "@/app/config";
import type {
  HttpError,
  HttpGateway,
  HttpRequestData,
  HttpResponse,
} from "@/core/application/ports";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"] as const;

export class HttpService implements HttpGateway {
  private readonly client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupAuthInterceptor();
    this.setupErrorInterceptor();
  }

  updateBaseUrl(newBaseUrl: string): void {
    this.client.defaults.baseURL = newBaseUrl;
  }

  private setupAuthInterceptor(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = cookieService.getAuthToken();
        const isPublicRoute = PUBLIC_ROUTES.some((route) =>
          config.url?.includes(route)
        );

        if (token && !isPublicRoute) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private setupErrorInterceptor(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle canceled requests
        if (axios.isCancel(error)) {
          return Promise.reject({
            message: "Request canceled",
            code: "REQUEST_CANCELED",
          } as HttpError);
        }

        const { response } = error;

        if (!response) {
          toast.error("Erro de conexão. Verifique sua internet.");
          return Promise.reject({
            message: "Erro de conexão com o servidor",
            code: "NETWORK_ERROR",
          } as HttpError);
        }

        const status = response.status;
        const data = response.data as Record<string, unknown>;
        let errorMessage = "Ocorreu um erro inesperado";

        switch (status) {
          case 400:
            errorMessage = (data.message as string) || "Requisição inválida";
            break;
          case 401:
            // Emit token expiration event
            authEventEmitter.emit("token-expired", {
              currentPath: window.location.pathname,
            });
            cookieService.removeAuthToken();
            return Promise.reject({
              message: "Token expired",
              code: "TOKEN_EXPIRED",
              status: 401,
            } as HttpError);
          case 403:
            errorMessage = "Você não tem permissão para acessar este recurso";
            break;
          case 404:
            errorMessage = "Recurso não encontrado";
            break;
          case 422:
            errorMessage = (data.message as string) || "Dados inválidos";
            break;
          case 500:
            errorMessage = "Erro interno do servidor";
            break;
          default:
            errorMessage =
              (data.message as string) ||
              `Erro ${status}: ${response.statusText}`;
        }

        toast.error(errorMessage);

        return Promise.reject({
          message: errorMessage,
          code: (data.code as string) || `ERROR_${status}`,
          status,
          details: data,
        } as HttpError);
      }
    );
  }

  get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.client.get(url, config);
  }

  post<T = unknown>(
    url: string,
    data?: HttpRequestData,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.client.post(url, data, config);
  }

  put<T = unknown>(
    url: string,
    data?: HttpRequestData,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.client.put(url, data, config);
  }

  patch<T = unknown>(
    url: string,
    data?: HttpRequestData,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.client.patch(url, data, config);
  }

  delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.client.delete(url, config);
  }
}

// Export singleton instance
export const httpService = new HttpService();
```

**Example - Feature Gateway Implementation**:

```typescript
// features/auth/infrastructure/gateways/auth-http.gateway.ts

import { httpService } from "@/infrastructure/http";
import { cookieService } from "@/infrastructure/storage";
import { env } from "@/app/config";
import type {
  AuthGateway,
  LoginInput,
  SignupInput,
} from "@/features/auth/application/ports";
import type { Session, UserProfile } from "@/features/auth/domain/entities";

const API_ENDPOINT = `${env.VITE_API_BASE_URL}/auth`;

export class AuthHttpGateway implements AuthGateway {
  async login(input: LoginInput): Promise<Session> {
    const response = await httpService.post<LoginResponse>(
      `${API_ENDPOINT}/login`,
      input as unknown as Record<string, unknown>
    );

    if (!response.data || !response.data.token) {
      throw new Error("Token de autenticação não encontrado na resposta");
    }

    const session: Session = {
      user: response.data.user,
      organizations: response.data.organizations,
      permissions: response.data.permissions,
      token: response.data.token,
    };

    // Store token in cookies
    cookieService.setAuthToken(response.data.token);

    return session;
  }

  async signup(input: SignupInput): Promise<boolean> {
    const response = await httpService.post<unknown>(
      `${API_ENDPOINT}/register`,
      input as unknown as Record<string, unknown>
    );

    return !!response.data;
  }

  async logout(): Promise<void> {
    try {
      await httpService.post("/auth/logout");
    } finally {
      cookieService.removeAuthToken();
    }
  }

  async fetchUserProfile(): Promise<UserProfile> {
    const response = await httpService.get<UserProfile>(
      `${API_ENDPOINT}/profile`,
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );

    if (!response.data) {
      throw new Error("Perfil do usuário não encontrado ou inválido");
    }

    return response.data;
  }

  async validateToken(): Promise<boolean> {
    const token = cookieService.getAuthToken();
    if (!token) return false;

    try {
      const response = await httpService.get<{ success?: boolean }>(
        `${API_ENDPOINT}/validate`
      );

      if (!response.data || !response.data.success) {
        cookieService.removeAuthToken();
        return false;
      }

      return true;
    } catch {
      cookieService.removeAuthToken();
      return false;
    }
  }
}
```

**Example - Event Emitter**:

```typescript
// infrastructure/events/auth-events.ts

import mitt from "mitt";

type AuthEvents = {
  "token-expired": { currentPath: string };
  "user-logged-out": void;
};

export const authEventEmitter = mitt<AuthEvents>();
```

---

### 4. Presentation Layer (`features/*/presentation`)

UI components, hooks, and stores:

**Example - TanStack Store with Factory**:

```typescript
// shared/lib/store-factory.ts

import { Store } from "@tanstack/store";

export function createStore<T extends Record<string, unknown>>(
  initialState: T,
  name: string
) {
  const store = new Store<T>(initialState, {
    debugLabel: name,
  });

  // Selectors - for reading specific state slices
  const selectors = {
    getAll: () => store.state,
    get: <K extends keyof T>(key: K) => store.state[key],
  };

  // Updaters - for modifying state
  const updaters = {
    update: <K extends keyof T>(key: K, value: T[K]) => {
      store.setState((prev) => ({ ...prev, [key]: value }));
    },
    updateAll: (newState: Partial<T>) => {
      store.setState((prev) => ({ ...prev, ...newState }));
    },
    reset: () => {
      store.setState(initialState);
    },
  };

  return { store, selectors, updaters };
}
```

**Example - Feature Store**:

```typescript
// features/auth/presentation/stores/auth-session.store.ts

import { createStore } from "@/shared/lib/store-factory";
import type { Session } from "@/features/auth/domain/entities";

export interface AuthSessionState {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthSessionState = {
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const { store, selectors, updaters } = createStore(
  initialState,
  "auth-session"
);

export const authSessionStore = store;
export const authSessionSelectors = selectors;
export const authUpdaters = updaters;

// Actions - convenience methods
export const authSessionActions = {
  setSession: (session: Session | null) => {
    updaters.updateAll({
      session,
      isAuthenticated: !!session,
      error: null,
    });
  },

  setLoading: (isLoading: boolean) => {
    updaters.update("isLoading", isLoading);
  },

  setError: (error: string | null) => {
    updaters.update("error", error);
  },

  clearSession: () => {
    updaters.reset();
  },
};
```

**Example - Custom Hook**:

```typescript
// features/auth/presentation/hooks/use-login.ts

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { LoginUseCase } from "@/features/auth/application/use-cases";
import { AuthHttpGateway } from "@/features/auth/infrastructure/gateways";
import { authSessionActions } from "@/features/auth/presentation/stores";
import type { LoginInput } from "@/features/auth/application/ports";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginUseCase = new LoginUseCase(new AuthHttpGateway());

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    authSessionActions.setLoading(true);

    try {
      const session = await loginUseCase.execute(input);

      authSessionActions.setSession(session);
      toast.success("Login realizado com sucesso!");

      await navigate({ to: "/dashboard" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login";

      authSessionActions.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      authSessionActions.setLoading(false);
    }
  };

  return { login, isLoading };
}
```

**Example - Component**:

```typescript
// features/auth/presentation/components/login-form.tsx

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useLogin } from "@/features/auth/presentation/hooks";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export function LoginForm() {
  const { login, isLoading } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await login(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <Input
            type="email"
            placeholder="Email"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <Input
            type="password"
            placeholder="Senha"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
```

---

## State Management Strategy (MANDATORY)

**Use the RIGHT tool for each state type:**

### 1. Server State → TanStack Query

For data from backend APIs with caching, revalidation, and synchronization:

```typescript
// features/users/presentation/hooks/use-users-query.ts

import { useQuery } from "@tanstack/react-query";
import { GetUsersUseCase } from "@/features/users/application/use-cases";
import { UserHttpGateway } from "@/features/users/infrastructure/gateways";

export function useUsersQuery() {
  const gateway = new UserHttpGateway();
  const useCase = new GetUsersUseCase(gateway);

  return useQuery({
    queryKey: ["users"],
    queryFn: () => useCase.execute(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 2. Global Client State → TanStack Store

For application-wide client state (auth, theme, preferences):

```typescript
// shared/stores/theme.store.ts

import { createStore } from "@/shared/lib/store-factory";

export type Theme = "light" | "dark" | "system";

export interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: "system",
};

const { store, selectors, updaters } = createStore(initialState, "theme");

export const themeStore = store;
export const themeSelectors = selectors;

export const themeActions = {
  setTheme: (theme: Theme) => {
    updaters.update("theme", theme);
  },
};
```

### 3. Form State → TanStack Form

For form management with validation:

```typescript
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
});

export function UserForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
    validators: {
      onChange: userSchema,
    },
  });

  // ... render form
}
```

### 4. URL State → TanStack Router

For URL parameters and search params:

```typescript
// routes/users/$userId.tsx

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const userSearchSchema = z.object({
  tab: z.enum(["profile", "settings"]).optional(),
});

export const Route = createFileRoute("/users/$userId")({
  validateSearch: userSearchSchema,
  component: UserDetail,
});

function UserDetail() {
  const { userId } = Route.useParams();
  const { tab = "profile" } = Route.useSearch();

  return (
    <div>
      <h1>User {userId}</h1>
      <p>Active tab: {tab}</p>
    </div>
  );
}
```

### 5. Local Component State → useState/useReducer

For component-specific state:

```typescript
export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## TanStack Router Patterns (MANDATORY)

### File-Based Routing

```typescript
// routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div>
      <nav>Navigation</nav>
      <Outlet />
    </div>
  ),
});

// routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <h1>Home</h1>;
}
```

### Type-Safe Navigation

```typescript
import { Link, useNavigate } from "@tanstack/react-router";

export function Navigation() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Type-safe Link */}
      <Link to="/users/$userId" params={{ userId: "123" }}>
        View User
      </Link>

      {/* Programmatic navigation */}
      <button
        onClick={() => {
          navigate({
            to: "/users/$userId",
            params: { userId: "456" },
            search: { tab: "settings" },
          });
        }}
      >
        Go to User Settings
      </button>
    </div>
  );
}
```

### Loaders and Prefetching

```typescript
// routes/users/$userId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/infrastructure/query";
import { getUserQueryOptions } from "@/features/users/presentation/hooks/use-user";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(getUserQueryOptions(params.userId));
  },
  component: UserDetail,
});
```

---

## Performance Patterns

### 1. Code Splitting with TanStack Router

```typescript
// routes/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const DashboardPage = lazy(
  () => import("@/features/dashboard/presentation/pages/dashboard-page")
);

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});
```

### 2. Optimistic Updates with TanStack Query

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => updateUser(user),
    onMutate: async (updatedUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users", updatedUser.id] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(["users", updatedUser.id]);

      // Optimistically update
      queryClient.setQueryData(["users", updatedUser.id], updatedUser);

      return { previousUser };
    },
    onError: (err, updatedUser, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["users", updatedUser.id],
        context?.previousUser
      );
    },
    onSettled: (updatedUser) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["users", updatedUser?.id] });
    },
  });
}
```

### 3. Efficient Rendering with React.memo

```typescript
import { memo } from "react";

interface UserCardProps {
  user: User;
  onSelect: (id: string) => void;
}

export const UserCard = memo(({ user, onSelect }: UserCardProps) => {
  return (
    <div onClick={() => onSelect(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

---

## Component Organization Principles (MANDATORY)

### 1. Keep Components Small (< 150 lines)

```typescript
// ✅ Good - Extract into smaller components
export function UserDashboard() {
  return (
    <div>
      <UserHeader />
      <UserStats />
      <UserActivity />
    </div>
  );
}
```

### 2. Extract Logic into Hooks (< 20 lines in component)

```typescript
// ✅ Good - Extract into custom hook
export function UserList() {
  const { users, loading, error } = useUsers();

  if (loading) return <Loading />;
  if (error) return <Error />;

  return <div>{/* Render users */}</div>;
}
```

### 3. One Component Per File

```typescript
// ✅ Good - Separate files
// user-card.tsx
export function UserCard() {}

// user-avatar.tsx
export function UserAvatar() {}
```

---

## Testing Strategy by Layer

### Domain Layer Tests

```typescript
// features/auth/domain/__tests__/email.vo.test.ts

import { describe, it, expect } from "bun:test";
import { Email } from "../value-objects/email.vo";

describe("Email Value Object", () => {
  it("creates valid email", () => {
    const email = Email.create("user@example.com");
    expect(email.toString()).toBe("user@example.com");
  });

  it("throws error for invalid email", () => {
    expect(() => Email.create("invalid")).toThrow("Invalid email format");
  });
});
```

### Application Layer Tests (Use Cases)

```typescript
// features/auth/application/__tests__/login.use-case.test.ts

import { describe, it, expect, mock } from "bun:test";
import { LoginUseCase } from "../use-cases/login.use-case";
import type { AuthGateway } from "../ports/auth.gateway";

describe("LoginUseCase", () => {
  it("successfully logs in user", async () => {
    const mockGateway: AuthGateway = {
      login: mock(() =>
        Promise.resolve({ id: "1", email: "user@example.com", token: "abc" })
      ),
      logout: mock(),
      signup: mock(),
      fetchUserProfile: mock(),
      validateToken: mock(),
    };

    const useCase = new LoginUseCase(mockGateway);
    const result = await useCase.execute({
      email: "user@example.com",
      password: "password123",
    });

    expect(result.id).toBe("1");
    expect(mockGateway.login).toHaveBeenCalled();
  });
});
```

### Presentation Layer Tests (Components)

```typescript
// features/auth/presentation/components/__tests__/login-form.test.tsx

import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { LoginForm } from "../login-form";

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
  });
});
```

---

## Common Patterns

### 1. Result Pattern for Expected Failures

```typescript
// shared/lib/result.ts

export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export function success<T>(value: T): Result<T> {
  return { success: true, value };
}

export function failure<E = Error>(error: E): Result<never, E> {
  return { success: false, error };
}
```

**Usage**:

```typescript
async function findUser(id: string): Promise<Result<User, NotFoundError>> {
  try {
    const response = await httpService.get<User>(`/users/${id}`);
    return success(response.data);
  } catch (error) {
    if (error.status === 404) {
      return failure(new NotFoundError("User not found"));
    }
    throw error;
  }
}
```

---

## Critical Rules

**NEVER:**

- Mix layers (e.g., UI logic in domain layer)
- Import from higher layers to lower layers
- Use concrete implementations in use cases (use ports/interfaces)
- Create god components (>150 lines)
- Keep complex logic in components (>20 lines)
- Use npm or pnpm commands (ALWAYS use Bun)
- Skip TypeScript types
- Hardcode configuration values
- Put business logic in presentation layer
- Use `any` type
- Bypass gateways (call httpService directly from components)

**ALWAYS:**

- Follow Clean Architecture layer separation
- Use dependency inversion with ports/interfaces
- Keep domain layer pure (no external dependencies)
- Extract component logic into custom hooks
- Use the right state management tool for each state type
- Implement type-safe routing with TanStack Router
- Write tests for each layer
- Use Bun for all package management
- Collocate tests in `__tests__/` folders
- Use functional components with TypeScript
- One component per file
- Keep components under 150 lines
- Keep use cases thin (delegate to gateways)
- Validate at boundaries (Zod schemas)
- Use event emitters for cross-feature communication

---

## Deliverables

When helping users, provide:

1. **Complete Folder Structure**: Organized by Clean Architecture layers
2. **Port Definitions**: TypeScript interfaces for dependency inversion
3. **Use Case Implementation**: Thin wrappers that delegate to gateways
4. **Gateway Implementations**: Infrastructure layer HTTP/storage adapters
5. **Presentation Hooks**: Custom hooks encapsulating use case execution
6. **Component Examples**: Type-safe, tested React components
7. **Router Configuration**: TanStack Router setup with type safety
8. **State Management Setup**: TanStack Store factories and TanStack Query
9. **Test Examples**: Tests for each layer with proper mocking
10. **Configuration Files**: Vite, TypeScript, Turborepo, and TanStack configurations

---

## Comparison: Frontend vs Backend

| Aspect         | Frontend                             | Backend                              |
| -------------- | ------------------------------------ | ------------------------------------ |
| **Use Cases**  | Thin wrappers (delegate to gateways) | Business logic + orchestration       |
| **State**      | TanStack Store (local state)         | Database (persistent state)          |
| **Ports**      | Gateways for HTTP, storage, events   | Repositories, external services      |
| **DI**         | Manual instantiation in hooks        | DI Container with Symbol tokens      |
| **Validation** | Zod at forms + API responses         | Zod at API boundaries                |
| **Errors**     | Toast notifications + state          | Exceptions + HTTP status codes       |
| **Testing**    | Mock gateways, component tests       | Mock repositories, integration tests |

---

## Summary

Frontend architecture focuses on:

1. **Simplicity**: Thin use cases, clear separation of concerns
2. **Testability**: Mock gateways, isolated components
3. **Maintainability**: Feature-based structure, consistent patterns
4. **Type Safety**: Strong typing, Zod validation, TanStack Router
5. **Performance**: Code splitting, lazy loading, optimistic updates
6. **User Experience**: Error handling, loading states, toast notifications
7. **Scalability**: Monorepo for multiple apps, shared packages

**Remember**: Good architecture makes change easy. Build systems that are testable, maintainable, and scalable from day one. Always respect layer boundaries and use dependency inversion to keep code decoupled.

Keep it simple. Don't over-engineer. Focus on testability and maintainability.
