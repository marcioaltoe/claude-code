---
name: frontend-engineer
description: Expert frontend engineering with simplified pragmatic architecture, React 19, TanStack ecosystem, and Zustand state management. Use when implementing frontend features, setting up project structure, creating pages and state management, designing gateway injection patterns, setting up HTTP communication and routing, organizing feature modules, or optimizing performance. **ALWAYS use when implementing Gateway Pattern (Interface + HTTP + Fake), Context API injection, Zustand stores, TanStack Router, or feature-based architecture.**
---

# Frontend Engineer Skill

**Purpose**: Expert frontend engineering with simplified pragmatic architecture, React 19, TanStack ecosystem, and Zustand state management. Provides implementation examples for building testable, maintainable, scalable frontend applications.

**When to Use**:

- Implementing frontend features and components
- Setting up project structure
- Creating pages and state management
- Designing gateway injection patterns
- Setting up HTTP communication and routing
- Organizing feature modules
- Performance optimization and code splitting

---

## Documentation Lookup (MANDATORY)

**ALWAYS use MCP servers for up-to-date documentation:**

- **Context7 MCP**: Use for comprehensive library documentation, API reference, import statements, and version-specific patterns

  - When user asks about TanStack Router, Query, Form, Table APIs
  - For React 19 features and patterns
  - For Vite configuration and build setup
  - For Zustand API and patterns
  - To verify correct import paths, hooks usage, and API patterns

- **Perplexity MCP**: Use for architectural research, design patterns, and best practices
  - When researching pragmatic frontend architectures
  - For state management strategies and trade-offs
  - For performance optimization techniques
  - For folder structure and code organization patterns
  - For troubleshooting complex architectural issues

**Examples of when to use MCP:**

- "How to setup TanStack Router file-based routing?" → Use Context7 MCP for TanStack Router docs
- "What are React 19 use() hook patterns?" → Use Context7 MCP for React docs
- "How to use Zustand with TypeScript?" → Use Context7 MCP for Zustand docs
- "Best practices for feature-based architecture in React?" → Use Perplexity MCP for research
- "How to configure Vite with React 19?" → Use Context7 MCP for Vite docs

---

## Tech Stack (MANDATORY)

**For complete frontend tech stack details, see `project-standards` skill and `ui-designer` skill**

**Quick Reference:**

### Core:

- **Runtime**: Bun (NOT npm or pnpm or yarn)
- **Framework**: React 19 + Vite 6 + TypeScript (strict mode)

### TanStack Ecosystem:

- **Router**: TanStack Router 1.x (file-based, type-safe)
- **Data Fetching**: TanStack Query 5.x
- **Forms**: TanStack Form 1.x

### State Management:

- **Global State**: Zustand (NOT TanStack Store)
- **Server State**: TanStack Query
- **Form State**: TanStack Form
- **URL State**: TanStack Router

### UI:

- **Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React

### Testing:

- **Unit**: Bun test + React Testing Library
- **E2E**: Playwright

→ See `project-standards` skill for complete tech stack
→ See `ui-designer` skill for UI/UX specific technologies
→ See `docs/plans/2025-10-24-simplified-frontend-architecture-design.md` for architecture details

---

## Architecture Overview

Frontend follows a **simplified, pragmatic, feature-based architecture**.

**Core Principles:**

1. **Feature-based organization** - Code grouped by business functionality
2. **Pages as use cases** - Pages orchestrate business logic
3. **Externalized state** - Zustand stores are framework-agnostic, 100% testable
4. **Gateway injection** - Gateways injected via Context API for isolated testing
5. **YAGNI rigorously** - No unnecessary layers or abstractions

**Design Philosophy**: Simplicity and pragmatism over architectural purity. Remove Clean Architecture complexity (domain/application/infrastructure layers) in favor of direct, maintainable code.

### Recommended Structure

```
apps/web/src/
├── app/                              # Application setup
│   ├── config/
│   │   ├── env.ts                   # Environment variables
│   │   └── index.ts
│   ├── providers/
│   │   ├── gateway-provider.tsx     # Gateway injection (Context API)
│   │   ├── query-provider.tsx       # TanStack Query setup
│   │   ├── theme-provider.tsx       # Theme provider (shadcn/ui)
│   │   └── index.ts
│   ├── router.tsx                   # TanStack Router configuration
│   └── main.tsx                     # Application entry point
│
├── features/                         # Feature modules (self-contained)
│   ├── auth/
│   │   ├── components/              # Pure UI components
│   │   │   ├── login-form.tsx
│   │   │   └── index.ts
│   │   ├── pages/                   # Use cases - orchestrate logic
│   │   │   ├── login-page.tsx
│   │   │   └── index.ts
│   │   ├── stores/                  # Zustand stores - testable entities
│   │   │   ├── auth-store.ts
│   │   │   └── index.ts
│   │   ├── gateways/                # External resource abstractions
│   │   │   ├── auth-gateway.ts      # Interface + HTTP implementation
│   │   │   ├── auth-gateway.fake.ts # Fake for unit tests
│   │   │   └── index.ts
│   │   ├── hooks/                   # Custom hooks (optional)
│   │   │   └── index.ts
│   │   ├── types/                   # TypeScript types
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── index.ts                 # Barrel file - public API
│   │
│   ├── dashboard/
│   └── profile/
│
├── shared/                           # Shared code across features
│   ├── services/                    # Global services
│   │   ├── http-api.ts             # HTTP client base (Axios wrapper)
│   │   ├── storage.ts              # LocalStorage/Cookie abstraction
│   │   └── index.ts
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   └── layout/                 # Shared layouts
│   ├── hooks/                      # Global utility hooks
│   ├── lib/                        # Utilities and helpers
│   │   ├── validators.ts           # Zod schemas (common)
│   │   ├── formatters.ts
│   │   └── index.ts
│   └── types/                      # Global types
│
├── routes/                          # TanStack Router routes
│   ├── __root.tsx
│   ├── index.tsx
│   └── auth/
│       └── login.tsx
│
└── index.css
```

**Benefits**:

- ✅ Feature isolation - delete folder, remove feature
- ✅ No unnecessary layers - direct, maintainable code
- ✅ Testable business logic - Zustand stores are pure JS/TS
- ✅ Isolated page testing - inject fake gateways
- ✅ Clear separation - pages (orchestration), components (UI), stores (state)

---

## Layer Responsibilities (MANDATORY)

### 1. Shared Services Layer

**Purpose**: Reusable infrastructure used across features.

**Example - HTTP Client**:

```typescript
// shared/services/http-api.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export class HttpApi {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });

    // Auto-inject auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // Handle 401 globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Singleton instance
export const httpApi = new HttpApi(import.meta.env.VITE_API_URL);
```

---

### 2. Gateway Layer

**Purpose**: Abstract external resource access. Enable testing with fakes.

**Example - Auth Gateway**:

```typescript
// features/auth/gateways/auth-gateway.ts
import { httpApi } from "@/shared/services/http-api";
import type { User } from "../types/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Gateway interface (contract)
export interface AuthGateway {
  login(request: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
}

// Real implementation (HTTP)
export class AuthHttpGateway implements AuthGateway {
  async login(request: LoginRequest): Promise<LoginResponse> {
    return httpApi.post<LoginResponse>("/auth/login", request);
  }

  async logout(): Promise<void> {
    await httpApi.post("/auth/logout");
  }

  async getCurrentUser(): Promise<User> {
    return httpApi.get<User>("/auth/me");
  }
}

// Fake implementation for unit tests
export class AuthFakeGateway implements AuthGateway {
  private shouldFail = false;

  setShouldFail(value: boolean) {
    this.shouldFail = value;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.shouldFail) {
      throw new Error("Invalid credentials");
    }

    if (
      request.email === "test@example.com" &&
      request.password === "password123"
    ) {
      return {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          role: "user",
        },
        token: "fake-token-123",
      };
    }

    throw new Error("Invalid credentials");
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  async getCurrentUser(): Promise<User> {
    if (this.shouldFail) throw new Error("Unauthorized");
    return {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    };
  }
}
```

---

### 3. Gateway Injection (Context API)

**Purpose**: Provide gateways to components. Allow override in tests.

**Example**:

```typescript
// app/providers/gateway-provider.tsx
import { createContext, useContext, type ReactNode } from "react";
import {
  AuthGateway,
  AuthHttpGateway,
} from "@/features/auth/gateways/auth-gateway";

interface Gateways {
  authGateway: AuthGateway;
  // Add more gateways as needed
}

const GatewayContext = createContext<Gateways | null>(null);

interface GatewayProviderProps {
  children: ReactNode;
  gateways?: Partial<Gateways>; // Allow override for tests
}

export function GatewayProvider({ children, gateways }: GatewayProviderProps) {
  const defaultGateways: Gateways = {
    authGateway: new AuthHttpGateway(),
  };

  const value = { ...defaultGateways, ...gateways };

  return (
    <GatewayContext.Provider value={value}>{children}</GatewayContext.Provider>
  );
}

export function useGateways() {
  const context = useContext(GatewayContext);
  if (!context) {
    throw new Error("useGateways must be used within GatewayProvider");
  }
  return context;
}
```

---

### 4. Store Layer (Zustand)

**Purpose**: Testable business logic, framework-agnostic state management.

**Example**:

```typescript
// features/auth/stores/auth-store.ts
import { create } from "zustand";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ user: null, isAuthenticated: false, isLoading: false, error: null }),
}));
```

**Why Zustand:**

- ✅ Minimal boilerplate
- ✅ Excellent TypeScript support
- ✅ Framework-agnostic (100% testable without React)
- ✅ Large community and ecosystem
- ✅ Superior DX compared to alternatives

---

### 5. Page Layer (Use Cases)

**Purpose**: Orchestrate business logic by coordinating gateways, stores, and UI components.

**Example**:

```typescript
// features/auth/pages/login-page.tsx
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGateways } from "@/app/providers/gateway-provider";
import { useAuthStore } from "../stores/auth-store";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  const navigate = useNavigate();
  const { authGateway } = useGateways(); // Injected gateway
  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();

  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setFormError(null);

    try {
      const { user, token } = await authGateway.login({ email, password });

      localStorage.setItem("auth_token", token);
      setUser(user);

      navigate({ to: "/dashboard" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={formError}
      />
    </div>
  );
}
```

---

### 6. Component Layer

**Purpose**: Pure UI components that receive props and emit events.

**Example**:

```typescript
// features/auth/components/login-form.tsx
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          aria-label="Email"
        />
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          aria-label="Password"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Loading..." : "Login"}
      </Button>
    </form>
  );
}
```

---

## State Management Strategy (MANDATORY)

**Use the RIGHT tool for each state type:**

### 1. Global Client State → Zustand

For application-wide client state (auth, theme, preferences):

```typescript
// shared/stores/theme-store.ts
import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));
```

### 2. Server State → TanStack Query

For data from backend APIs with caching, revalidation, and synchronization:

```typescript
// features/users/hooks/use-users-query.ts
import { useQuery } from "@tanstack/react-query";
import { useGateways } from "@/app/providers/gateway-provider";

export function useUsersQuery() {
  const { userGateway } = useGateways();

  return useQuery({
    queryKey: ["users"],
    queryFn: () => userGateway.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 3. Form State → TanStack Form

For form management with validation:

```typescript
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export function UserForm() {
  const form = useForm({
    defaultValues: { name: "", email: "" },
    validatorAdapter: zodValidator(),
    validators: { onChange: userSchema },
    onSubmit: async ({ value }) => console.log(value),
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
      User {userId} - Tab: {tab}
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

## Testing Strategy (MANDATORY)

### Test Pyramid

```
        ┌─────────────┐
       ╱   E2E Tests   ╲       Few - Critical flows
      ╱   (Playwright)  ╲
     ╱─────────────────────╲
    ╱  Integration Tests   ╲  Some - Pages with fakes
   ╱   (Pages + Stores)     ╲
  ╱─────────────────────────╲
 ╱       Unit Tests          ╲ Many - Stores, utils
╱   (Stores, Utils, Comps)   ╲
─────────────────────────────
```

### Store Tests (Unit - High Priority)

Zustand stores are 100% testable without React:

```typescript
// features/auth/stores/auth-store.test.ts
import { describe, it, expect, beforeEach } from "bun:test";
import { useAuthStore } from "./auth-store";

describe("AuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it("should start with empty state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should update user and isAuthenticated when setting user", () => {
    const user = {
      id: "1",
      name: "Test",
      email: "test@example.com",
      role: "user",
    };

    useAuthStore.getState().setUser(user);

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

### Page Tests (Integration with Fake Gateways)

Test orchestration logic with injected fakes:

```typescript
// features/auth/pages/login-page.test.tsx
import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GatewayProvider } from "@/app/providers/gateway-provider";
import { AuthFakeGateway } from "../gateways/auth-gateway";
import { LoginPage } from "./login-page";
import { useAuthStore } from "../stores/auth-store";

describe("LoginPage", () => {
  let fakeAuthGateway: AuthFakeGateway;

  beforeEach(() => {
    fakeAuthGateway = new AuthFakeGateway();
    useAuthStore.getState().reset();
  });

  it("should login successfully and update store", async () => {
    const user = userEvent.setup();

    render(
      <GatewayProvider gateways={{ authGateway: fakeAuthGateway }}>
        <LoginPage />
      </GatewayProvider>
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  it("should show error when login fails", async () => {
    const user = userEvent.setup();
    fakeAuthGateway.setShouldFail(true);

    render(
      <GatewayProvider gateways={{ authGateway: fakeAuthGateway }}>
        <LoginPage />
      </GatewayProvider>
    );

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

### Component Tests (Unit - Pure UI)

```typescript
// features/auth/components/login-form.test.tsx
import { describe, it, expect, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("should render email and password fields", () => {
    render(<LoginForm onSubmit={mock()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should call onSubmit with correct values", async () => {
    const user = userEvent.setup();
    const onSubmit = mock();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith("test@example.com", "password123");
  });
});
```

### E2E Tests (Playwright - Critical Flows)

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("should login and redirect to dashboard", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("text=Welcome, Test User")).toBeVisible();
  });
});
```

---

## Naming Conventions (MANDATORY)

### Files and Folders

- **Files**: `kebab-case` with suffixes
- **Folders**: `kebab-case`

```
features/auth/
├── components/
│   ├── login-form.tsx              # Component: kebab-case
│   └── index.ts
├── pages/
│   ├── login-page.tsx              # Suffix: -page.tsx
│   └── index.ts
├── stores/
│   ├── auth-store.ts               # Suffix: -store.ts
│   └── index.ts
├── gateways/
│   ├── auth-gateway.ts             # Suffix: -gateway.ts
│   ├── auth-gateway.fake.ts        # Suffix: -gateway.fake.ts
│   └── index.ts
```

### Code Elements

**Components**:

```typescript
// ✅ Good
export function LoginForm({ onSubmit }: LoginFormProps) {}

// ❌ Avoid
export const loginForm = () => {}; // No arrow function exports
export function Form() {} // Too generic
```

**Pages**:

```typescript
// ✅ Good - "Page" suffix
export function LoginPage() {}

// ❌ Avoid
export function Login() {} // Confuses with component
```

**Stores**:

```typescript
// ✅ Good - "use" + name + "Store"
export const useAuthStore = create<AuthState>(...);

// ❌ Avoid
export const authStore = create(...); // Missing "use" prefix
```

**Gateways**:

```typescript
// ✅ Good - No "I" prefix
export interface AuthGateway {}
export class AuthHttpGateway implements AuthGateway {}
export class AuthFakeGateway implements AuthGateway {}

// ❌ Avoid
export interface IAuthGateway {} // No "I" prefix
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
      <Link to="/users/$userId" params={{ userId: "123" }}>
        View User
      </Link>

      <button
        onClick={() => {
          navigate({ to: "/users/$userId", params: { userId: "456" } });
        }}
      >
        Go to User
      </button>
    </div>
  );
}
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
// ✅ Good
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

## Critical Rules

**NEVER:**

- Use Clean Architecture layers (domain/application/infrastructure/presentation) - **REMOVED**
- Import stores in components (pass data via props)
- Call HTTP directly from components (use gateways)
- Use `any` type (use `unknown` with type guards)
- Skip TypeScript types
- Use npm, pnpm, yarn (use Bun)
- Create components > 150 lines
- Keep logic > 20 lines in components

**ALWAYS:**

- Organize by features (feature-based structure)
- Pages orchestrate logic (use gateways + stores)
- Externalize state to Zustand stores
- Inject gateways via Context API
- Write tests for stores (unit) and pages (integration with fakes)
- Use functional components with TypeScript
- One component per file
- Extract logic into custom hooks
- Use Bun for all package management
- Run `bun run craft` after creating/moving files

---

## Deliverables

When helping users, provide:

1. **Feature Folder Structure**: Organized with pages/, components/, stores/, gateways/
2. **Gateway Definitions**: Interface + HTTP implementation + Fake implementation
3. **Gateway Provider**: Context API setup for dependency injection
4. **Zustand Stores**: Framework-agnostic state management with actions
5. **Pages**: Orchestration logic using gateways and stores
6. **Components**: Pure UI components with props
7. **Router Configuration**: TanStack Router setup with type safety
8. **Test Examples**: Store tests, page tests with fakes, component tests, E2E
9. **Configuration Files**: Vite, TypeScript, TanStack configurations

---

## Summary

Frontend architecture focuses on:

1. **Simplicity**: No unnecessary layers, direct code, pragmatic patterns
2. **Testability**: Zustand stores (pure), pages with fake gateways, isolated components
3. **Maintainability**: Feature-based structure, clear responsibilities, consistent patterns
4. **Type Safety**: Strong typing, Zod validation, TanStack Router
5. **Performance**: Code splitting, lazy loading, optimistic updates
6. **User Experience**: Error handling, loading states, toast notifications

**Remember**: Good architecture makes change easy. Build systems that are simple, testable, and maintainable. Avoid over-engineering. Focus on delivering value.

---

**Reference**:

- Architecture design: `docs/plans/2025-10-24-simplified-frontend-architecture-design.md`
- Project standards: `project-standards` skill
- UI/UX: `ui-designer` skill
