# Simplified Frontend Architecture Design

**Date:** 2025-10-24
**Status:** Approved
**Author:** Architecture Team
**Stack:** React 19, Vite 6, TanStack Router, Zustand, TypeScript

## Overview

This document defines a simplified frontend architecture based on pragmatic principles: feature-based organization, testable business logic, and dependency injection for external resources. This approach replaces the previous complex Clean Architecture implementation with layers (domain/application/infrastructure) in favor of a more direct and maintainable structure.

### Design Goals

1. **Simplicity over architectural purity** - Remove unnecessary abstractions and layers
2. **Feature-based organization** - Group code by business functionality, not technical type
3. **Testable business logic** - Externalize state into framework-agnostic stores
4. **Isolated testing** - Inject gateways to enable unit testing of pages with fakes
5. **Developer experience** - Minimal boilerplate, clear conventions, fast iteration

## Architecture Principles

### 1. Feature-Based Organization

Code is organized by business domain (auth, dashboard, profile), not by technical type (components, hooks, stores). Each feature is a self-contained module that can be developed, tested, and removed independently.

**Rationale:** Colocation of related code improves maintainability and reduces cognitive load. Features are easier to understand and modify when everything related is in one place.

### 2. Pages as Use Cases

Pages (route-level components) orchestrate business logic. They coordinate stores, gateways, and UI components. Pages are responsible for the "how" of a feature's user flow.

**Rationale:** Concentrating orchestration logic in pages keeps components pure and reusable while maintaining a clear separation of concerns.

### 3. Externalized State (Zustand Stores)

Business logic lives in Zustand stores - plain JavaScript/TypeScript with zero React dependencies. Stores are the "entities" containing testable business rules.

**Rationale:** Framework-agnostic stores are 100% unit testable without React rendering. They can be tested with simple assertions and don't require complex testing library setup.

### 4. Gateway Injection Pattern

Gateways abstract access to external resources (API, localStorage). They are injected via Context API in production and easily swapped with fakes in tests.

**Rationale:** Dependency injection enables isolated unit testing of pages. Tests can verify orchestration logic without making real API calls or depending on external state.

### 5. YAGNI (You Aren't Gonna Need It)

No premature abstractions. No domain/application/infrastructure layers. No DTOs between layers. Only add complexity when actually needed.

**Rationale:** Simpler codebases are easier to understand, modify, and maintain. Unnecessary abstractions create cognitive overhead and slow down development.

## Folder Structure

```
apps/web/src/
├── app/                              # Application setup and configuration
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
│   │   ├── components/              # Pure UI components (no business logic)
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── index.ts
│   │   ├── pages/                   # Use cases - orchestrate logic
│   │   │   ├── login-page.tsx
│   │   │   ├── register-page.tsx
│   │   │   └── index.ts
│   │   ├── stores/                  # Zustand stores - testable entities
│   │   │   ├── auth-store.ts
│   │   │   └── index.ts
│   │   ├── gateways/                # External resource abstractions
│   │   │   ├── auth-gateway.ts      # Interface + HTTP implementation
│   │   │   ├── auth-gateway.fake.ts # Fake for unit tests
│   │   │   └── index.ts
│   │   ├── hooks/                   # Custom hooks (optional)
│   │   │   ├── use-login.ts
│   │   │   └── index.ts
│   │   ├── types/                   # TypeScript types
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── index.ts                 # Barrel file - public API
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── gateways/
│   │   └── index.ts
│   │
│   └── profile/
│       └── ...
│
├── shared/                           # Shared code across features
│   ├── services/                    # Global services
│   │   ├── http-api.ts             # HTTP client base (Axios wrapper)
│   │   ├── storage.ts              # LocalStorage/Cookie abstraction
│   │   ├── logger.ts               # Logger service
│   │   └── index.ts
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/                 # Shared layouts
│   │   │   ├── app-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                      # Global utility hooks
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   └── index.ts
│   ├── lib/                        # Utilities and helpers
│   │   ├── validators.ts           # Zod schemas (common)
│   │   ├── formatters.ts           # Date, currency, etc formatters
│   │   ├── constants.ts
│   │   └── index.ts
│   └── types/                      # Global types
│       ├── api.ts                  # API response/request types
│       ├── common.ts               # Utility types
│       └── index.ts
│
├── routes/                          # TanStack Router routes
│   ├── __root.tsx                  # Root layout
│   ├── index.tsx                   # Home page
│   ├── auth/
│   │   ├── login.tsx               # Imports from features/auth/pages
│   │   └── register.tsx
│   └── dashboard/
│       └── index.tsx
│
└── index.css                        # Tailwind imports
```

### Folder Organization Rules

1. **Feature self-containment:** Everything related to a feature lives in its folder
2. **Shared code:** If used by 2+ features, move to `shared/`
3. **No cross-feature imports:** Features should not import from other features directly
4. **Barrel files:** Each folder exports its public API via `index.ts`
5. **Auto-generation:** Run `bun run craft` after creating/moving files to update barrel files

## Implementation Details

### Shared Services Layer

**Purpose:** Reusable infrastructure used across multiple features.

**Example: HTTP Client (`shared/services/http-api.ts`)**

```typescript
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

### Gateway Layer

**Purpose:** Abstract external resource access (API, localStorage). Enable testing with fakes.

**Example: Auth Gateway (`features/auth/gateways/auth-gateway.ts`)**

```typescript
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

### Gateway Injection (Context API)

**Purpose:** Provide gateways to components. Allow override in tests.

**Example: Gateway Provider (`app/providers/gateway-provider.tsx`)**

```typescript
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

### Store Layer (Zustand)

**Purpose:** Testable business logic, framework-agnostic state management.

**Example: Auth Store (`features/auth/stores/auth-store.ts`)**

```typescript
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

### Page Layer (Use Cases)

**Purpose:** Orchestrate business logic by coordinating gateways, stores, and UI components.

**Example: Login Page (`features/auth/pages/login-page.tsx`)**

```typescript
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

## Data Flow and Communication

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interaction                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Page (Use Case)                                             │
│  - Orchestrates business logic                               │
│  - Consumes Gateways (injected via Context)                 │
│  - Consumes/Updates Stores (Zustand)                        │
│  - Renders Components                                       │
└──────────────┬─────────────────────┬────────────────────────┘
               │                     │
               ▼                     ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Store (Zustand)     │  │  Gateway (Injected)  │
│  - Global state      │  │  - Interface         │
│  - Business logic    │  │  - HttpGateway       │
│  - 100% testable     │  │  - FakeGateway       │
└──────────────────────┘  └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │  Shared Services     │
                          │  - HttpApi           │
                          │  - Storage           │
                          └──────────────────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │  External (API/LS)   │
                          └──────────────────────┘
```

### Dependency Rules

**Allowed Imports:**

```typescript
// ✅ Pages can import:
import { useAuthStore } from "../stores/auth-store"; // Feature store
import { useGateways } from "@/app/providers"; // Injected gateways
import { LoginForm } from "../components/login-form"; // Feature components
import { Button } from "@/shared/components/ui/button"; // Shared components

// ✅ Stores can import:
import type { User } from "../types/user"; // Feature types
import type { ApiError } from "@/shared/types/api"; // Shared types

// ✅ Gateways can import:
import { httpApi } from "@/shared/services/http-api"; // Shared services
import type { User } from "../types/user"; // Feature types

// ✅ Components can import:
import { Button } from "@/shared/components/ui/button"; // Shared components
import type { User } from "../types/user"; // Feature types
```

**Forbidden Imports:**

```typescript
// ❌ Stores should NOT import gateways directly
import { authGateway } from "../gateways/auth-gateway";

// ❌ Components should NOT import stores
import { useAuthStore } from "../stores/auth-store";

// ❌ Components should NOT import gateways
import { useGateways } from "@/app/providers";

// ❌ Features should NOT import from other features
import { useUserStore } from "@/features/user/stores/user-store";
```

### Layer Responsibilities

| Layer               | Responsibilities                                          | Should NOT                                |
| ------------------- | --------------------------------------------------------- | ----------------------------------------- |
| **Pages**           | Orchestrate logic, coordinate gateways/stores, navigation | Complex business logic, direct API access |
| **Components**      | Pure UI, receive props, emit events                       | Access stores, gateways, business logic   |
| **Stores**          | Global state, testable business logic, mutations          | Call API directly (pages do this)         |
| **Gateways**        | Access external resources (API, localStorage)             | Business logic, state manipulation        |
| **Shared Services** | Reusable infrastructure (HTTP, storage, logger)           | Know about specific features              |

## Naming Conventions

### Files and Folders

- **Files:** `kebab-case` (e.g., `login-form.tsx`, `auth-store.ts`)
- **Folders:** `kebab-case` (e.g., `features/auth/`, `shared/components/`)
- **Components:** PascalCase in code, kebab-case filename (e.g., `LoginForm` in `login-form.tsx`)

### Code Elements

**Components:**

```typescript
// ✅ Good
export function LoginForm({ onSubmit }: LoginFormProps) {}
export function PasswordInput({ value, onChange }: PasswordInputProps) {}

// ❌ Avoid
export const loginForm = () => {}; // Don't use arrow function exports
export function Form() {} // Too generic
```

**Pages:**

```typescript
// ✅ Good - "Page" suffix
export function LoginPage() {}
export function DashboardPage() {}

// ❌ Avoid
export function Login() {} // Confuses with component
export function AuthLogin() {} // Redundant prefix
```

**Stores:**

```typescript
// ✅ Good - "use" + name + "Store"
export const useAuthStore = create<AuthState>(...);
export const useUserProfileStore = create<UserProfileState>(...);

// ❌ Avoid
export const authStore = create(...);     // Missing "use" prefix
export const useAuth = create(...);       // Missing "Store" suffix
```

**Gateways:**

```typescript
// ✅ Good - No "I" prefix, descriptive suffixes
export interface AuthGateway {}
export class AuthHttpGateway implements AuthGateway {}
export class AuthFakeGateway implements AuthGateway {}

// ❌ Avoid
export interface IAuthGateway {} // No "I" prefix
export class AuthGatewayImpl {} // "Impl" is redundant
```

**Custom Hooks:**

```typescript
// ✅ Good - "use" prefix
export function useLogin() {}
export function useDebounce<T>(value: T, delay: number) {}

// ❌ Avoid
export function login() {} // Missing "use" prefix
export const useLoginHook = () => {}; // "Hook" is redundant
```

**Types and Interfaces:**

```typescript
// ✅ Good - PascalCase, no prefix
export interface User { }
export interface LoginRequest { }
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

// ❌ Avoid
export interface IUser { }               // No "I" prefix
export type UserType { }                 // "Type" suffix redundant
```

**Constants:**

```typescript
// ✅ Good - SCREAMING_SNAKE_CASE
export const API_BASE_URL = "https://api.example.com";
export const MAX_LOGIN_ATTEMPTS = 3;

// ❌ Avoid
export const apiBaseUrl = "https://api.example.com";
export const MaxLoginAttempts = 3;
```

### Import Organization

```typescript
// 1. React and external libraries
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

// 2. App providers and contexts
import { useGateways } from "@/app/providers/gateway-provider";

// 3. Shared (services, components, hooks, types)
import { Button } from "@/shared/components/ui/button";
import { httpApi } from "@/shared/services/http-api";
import type { ApiError } from "@/shared/types/api";

// 4. Feature local (stores, gateways, components, types)
import { useAuthStore } from "../stores/auth-store";
import { LoginForm } from "../components/login-form";
import type { User } from "../types/user";

// 5. Styles (if any)
import "./login-page.css";
```

### Barrel Files

**Feature barrel - export public API only:**

```typescript
// features/auth/index.ts - ✅ Good
export { LoginPage } from "./pages/login-page";
export { RegisterPage } from "./pages/register-page";
export { useAuthStore } from "./stores/auth-store";
export type { User, AuthStatus } from "./types/user";

// ❌ Avoid exporting internals
// export { LoginForm } from './components/login-form';  // Internal component
// export { authGateway } from './gateways/auth-gateway'; // Gateway is injected
```

**Folder barrel - export everything:**

```typescript
// features/auth/components/index.ts - ✅ Good
export { LoginForm } from "./login-form";
export { RegisterForm } from "./register-form";
export { PasswordInput } from "./password-input";
```

**IMPORTANT:** Run `bun run craft` after creating/moving files to auto-update barrel files.

## Testing Strategy

### Test Pyramid

```
        ┌─────────────┐
       ╱   E2E Tests   ╲       Few - Critical user flows
      ╱   (Playwright)  ╲      - Login flow
     ╱─────────────────────╲   - Checkout flow
    ╱                       ╲
   ╱   Integration Tests     ╲  Some - Pages with fake gateways
  ╱   (Pages + Stores)        ╲ - LoginPage with AuthFakeGateway
 ╱─────────────────────────────╲
╱                               ╲
╱        Unit Tests              ╲ Many - Fast, isolated
╱   (Stores, Utils, Components)  ╲ - Store logic
╱─────────────────────────────────╲ - Formatters, validators
                                    - Pure UI components
```

### Testing Each Layer

**Stores (Unit Tests - High Priority)**

Zustand stores are 100% testable without React.

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

**Pages (Integration Tests with Fake Gateways)**

Test orchestration logic with injected fakes.

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

**Components (Unit Tests - Pure UI)**

Test rendering and interaction without business logic.

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

**E2E Tests (Playwright - Critical Flows)**

Test complete user journeys.

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

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrong");
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL("/auth/login");
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });
});
```

### Test Coverage Targets

| Layer          | Coverage Target | Priority  |
| -------------- | --------------- | --------- |
| **Stores**     | 90%+            | High ✅   |
| **Utils/Lib**  | 90%+            | High ✅   |
| **Pages**      | 70-80%          | Medium 🟡 |
| **Components** | 60-70%          | Medium 🟡 |
| **Gateways**   | E2E covers      | Low ⚪    |
| **E2E**        | Critical flows  | High ✅   |

### Testing Best Practices

**✅ DO:**

- Test stores in isolation (100% testable without React)
- Use fake gateways to test pages
- Test pure components without mocking stores
- E2E for critical business flows
- Clean state between tests (`beforeEach`)
- Use `waitFor` for async operations

**❌ DON'T:**

- Don't mock Zustand stores in component tests (inject props instead)
- Don't test implementation details (test behavior)
- Don't create brittle tests (avoid specific CSS selectors)
- Don't duplicate tests (if E2E covers it, skip integration)

### Test Commands

```bash
# Unit and integration tests (Bun)
bun test

# Tests with coverage
bun test --coverage

# E2E tests (Playwright)
bun run test:e2e

# E2E with UI
bun run test:e2e:ui

# Complete quality gates (format, lint, type-check, test)
bun run craft && bun run quality:check
```

## Migration Path

### From Current Clean Architecture

**Steps to migrate existing features:**

1. **Create new folder structure** for the feature in `features/`
2. **Move and flatten components:**
   - `presentation/components/` → `components/`
   - `presentation/pages/` → `pages/`
3. **Convert use cases to Zustand stores:**
   - Extract business logic from use case classes
   - Create Zustand store with actions
4. **Combine gateway implementations:**
   - Keep gateway interface
   - Merge HTTP adapter into `{Feature}HttpGateway`
   - Create `{Feature}FakeGateway` for tests
5. **Update pages to use Context API:**
   - Inject gateways via `useGateways()`
   - Remove direct use case instantiation
6. **Remove unused layers:**
   - Delete `domain/`, `application/`, `infrastructure/` if now empty
7. **Update tests:**
   - Store tests remain similar
   - Page tests use `GatewayProvider` with fakes
8. **Update barrel files:**
   - Run `bun run craft`

### New Feature Scaffold

When creating a new feature, use this template:

```bash
# Create feature structure
mkdir -p features/new-feature/{components,pages,stores,gateways,hooks,types}

# Create index files
touch features/new-feature/{components,pages,stores,gateways,hooks,types}/index.ts
touch features/new-feature/index.ts

# Update barrel files
bun run craft
```

## Decision Log

### Why Zustand over TanStack Store?

- **Developer experience:** Zustand has minimal boilerplate and excellent TypeScript support
- **Community:** Larger ecosystem, more examples, more resources
- **Testing:** Simpler API for testing stores in isolation
- **Trade-off:** TanStack Store integrates natively with Router/Query, but the DX benefits of Zustand outweigh this

### Why Context API for Gateway Injection?

- **React-native:** No external dependencies, built into React
- **Simple:** Straightforward API, easy to understand
- **Testable:** Easy to override in tests with fake implementations
- **Trade-off:** Not as powerful as dedicated DI libraries, but sufficient for our needs

### Why Not Clean Architecture Layers?

- **Complexity:** Domain/Application/Infrastructure layers add cognitive overhead
- **Overhead:** DTOs, ports/adapters, use case classes create unnecessary boilerplate
- **Frontend reality:** UI and business logic are often tightly coupled in frontend
- **Trade-off:** Less architectural purity, but much better developer experience and maintainability

### Why Pages Instead of Screens?

- **Convention:** "pages" is the dominant naming in React web (2024-2025)
- **Clarity:** Clearly indicates route-level components
- **Ecosystem:** Aligns with Next.js, Remix, and other React frameworks
- **Trade-off:** None - "screens" is primarily React Native terminology

## References

- [Scalable React Projects with Feature-Based Architecture](https://dev.to/naserrasouli/scalable-react-projects-with-feature-based-architecture-117c)
- [React Folder Structure Best Practices (2025)](https://profy.dev/article/react-folder-structure)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)

## Appendix

### Example Feature: Auth

Complete example of the auth feature following this architecture:

**File structure:**

```
features/auth/
├── components/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── password-input.tsx
│   └── index.ts
├── pages/
│   ├── login-page.tsx
│   ├── register-page.tsx
│   └── index.ts
├── stores/
│   ├── auth-store.ts
│   └── index.ts
├── gateways/
│   ├── auth-gateway.ts
│   ├── auth-gateway.fake.ts
│   └── index.ts
├── types/
│   ├── user.ts
│   ├── auth.ts
│   └── index.ts
└── index.ts
```

### Checklist for New Features

- [ ] Create feature folder structure
- [ ] Implement gateway interface and HTTP implementation
- [ ] Create fake gateway for testing
- [ ] Implement Zustand store with business logic
- [ ] Create pages that orchestrate gateways + stores
- [ ] Create pure UI components
- [ ] Write unit tests for store
- [ ] Write integration tests for pages (with fake gateway)
- [ ] Write component tests for UI
- [ ] Add E2E tests for critical flows
- [ ] Run `bun run craft` to update barrel files
- [ ] Update `GatewayProvider` to include new gateway
- [ ] Document any non-obvious decisions

### Common Patterns

**Loading states:**

```typescript
export function SomePage() {
  const { someGateway } = useGateways();
  const { setLoading } = useSomeStore();

  const handleAction = async () => {
    setLoading(true);
    try {
      await someGateway.doSomething();
    } finally {
      setLoading(false);
    }
  };
}
```

**Error handling:**

```typescript
export function SomePage() {
  const { someGateway } = useGateways();
  const { setError } = useSomeStore();

  const handleAction = async () => {
    try {
      await someGateway.doSomething();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  };
}
```

**Navigation after success:**

```typescript
export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const result = await authGateway.login({ email, password });
    if (result.success) {
      navigate({ to: "/dashboard" });
    }
  };
}
```
