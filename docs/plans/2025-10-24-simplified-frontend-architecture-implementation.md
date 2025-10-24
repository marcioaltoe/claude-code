# Simplified Frontend Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Clean Architecture (4 layers) with simplified pragmatic architecture in frontend skills and update global documentation to reflect the new standard.

**Architecture:** Feature-based organization with pages (use cases), components (UI), stores (Zustand), and gateways (injected via Context API). Removes domain/application/infrastructure/presentation complexity in favor of direct, testable code.

**Tech Stack:** React 19, Vite 6, Zustand, TanStack Router, TanStack Query, TanStack Form, shadcn/ui, Tailwind CSS 4, Bun, TypeScript (strict)

---

## Pre-Implementation

**Status:** ✅ COMPLETED

- ✅ Design documented in `docs/plans/2025-10-24-simplified-frontend-architecture-design.md`
- ✅ Skills updated:
  - `plugins/architecture-design/skills/frontend-engineer/SKILL.md`
  - `plugins/architecture-design/skills/architecture-auditor/SKILL.md`

---

## Task 1: Update Global CLAUDE.md

**Files:**

- Modify: `/Users/marcio/.claude/CLAUDE.md` (Frontend Architecture section)

**Step 1: Read current CLAUDE.md frontend section**

```bash
grep -A 50 "Frontend:" ~/.claude/CLAUDE.md
```

Expected: Find section with TanStack Store and Clean Architecture references

**Step 2: Update Frontend Architecture section**

Replace the "Frontend:" section with:

```markdown
### Frontend:

- Framework: React 19 + Vite 6
- Router: TanStack Router
- UI: shadcn/ui + Tailwind 4
- State Management: Zustand (global client state) + TanStack Query (server state)

**Architecture:** Simplified feature-based organization

- Pages orchestrate business logic (use cases)
- Components are pure UI (no stores/gateways)
- Stores (Zustand) are framework-agnostic, 100% testable
- Gateways injected via Context API for isolated testing

**Structure per feature:**
```

features/[name]/
├── components/ # Pure UI
├── pages/ # Use cases (orchestration)
├── stores/ # Zustand (state + actions)
├── gateways/ # Interface + HTTP + Fake
├── hooks/ # Custom hooks (optional)
└── types/ # TypeScript types

```

**NO Clean Architecture layers (domain/application/infrastructure/presentation)**
```

**Step 3: Verify changes**

```bash
grep -A 30 "Frontend:" ~/.claude/CLAUDE.md | grep -E "Zustand|pages|components|stores|gateways"
```

Expected: See new structure, Zustand mentioned, NO Clean Architecture

**Step 4: Commit**

```bash
git add ~/.claude/CLAUDE.md
git commit -m "docs: update global CLAUDE.md with simplified frontend architecture

- Replace Clean Architecture (4 layers) with simplified structure
- Update state management: Zustand replaces TanStack Store
- Document pages/components/stores/gateways organization
- Remove domain/application/infrastructure/presentation layers"
```

---

## Task 2: Create Example Feature Scaffold (Auth)

**Files:**

- Create: `examples/frontend/simplified-architecture/auth/` directory structure

**Step 1: Create directory structure**

```bash
mkdir -p examples/frontend/simplified-architecture/auth/{components,pages,stores,gateways,hooks,types}
```

**Step 2: Verify structure created**

```bash
tree examples/frontend/simplified-architecture/auth/
```

Expected:

```
auth/
├── components/
├── pages/
├── stores/
├── gateways/
├── hooks/
└── types/
```

**Step 3: Commit**

```bash
git add examples/frontend/simplified-architecture/
git commit -m "chore: create auth example feature scaffold

- Add directory structure for simplified architecture example
- Includes: components, pages, stores, gateways, hooks, types"
```

---

## Task 3: Create Auth Types

**Files:**

- Create: `examples/frontend/simplified-architecture/auth/types/user.ts`
- Create: `examples/frontend/simplified-architecture/auth/types/index.ts`

**Step 1: Create user type**

```typescript
// examples/frontend/simplified-architecture/auth/types/user.ts
export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "admin" | "user" | "guest";
}
```

**Step 2: Create barrel file**

```typescript
// examples/frontend/simplified-architecture/auth/types/index.ts
export type { User } from "./user";
```

**Step 3: Verify TypeScript compiles**

```bash
cd examples/frontend/simplified-architecture/auth/types/
bun tsc --noEmit user.ts
```

Expected: No errors

**Step 4: Commit**

```bash
git add examples/frontend/simplified-architecture/auth/types/
git commit -m "feat(auth): add User type definition

- Create User interface with id, name, email, role
- Add barrel file for clean imports"
```

---

## Task 4: Create Auth Gateway (TDD)

**Files:**

- Create: `examples/frontend/simplified-architecture/auth/gateways/auth-gateway.ts`
- Create: `examples/frontend/simplified-architecture/auth/gateways/auth-gateway.test.ts`
- Create: `examples/frontend/simplified-architecture/auth/gateways/index.ts`

**Step 1: Write the failing test**

```typescript
// examples/frontend/simplified-architecture/auth/gateways/auth-gateway.test.ts
import { describe, it, expect } from "bun:test";
import { AuthFakeGateway } from "./auth-gateway";

describe("AuthFakeGateway", () => {
  it("should login successfully with valid credentials", async () => {
    const gateway = new AuthFakeGateway();

    const result = await gateway.login({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("test@example.com");
    expect(result.token).toBe("fake-token-123");
  });

  it("should throw error with invalid credentials", async () => {
    const gateway = new AuthFakeGateway();
    gateway.setShouldFail(true);

    await expect(
      gateway.login({ email: "wrong@example.com", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd examples/frontend/simplified-architecture/auth/gateways/
bun run test auth-gateway.test.ts
```

Expected: FAIL with "AuthFakeGateway is not defined"

**Step 3: Write minimal gateway implementation**

```typescript
// examples/frontend/simplified-architecture/auth/gateways/auth-gateway.ts
import type { User } from "../types/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthGateway {
  login(request: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
}

export class AuthHttpGateway implements AuthGateway {
  async login(request: LoginRequest): Promise<LoginResponse> {
    // Implementation would use httpApi service
    throw new Error("Not implemented");
  }

  async logout(): Promise<void> {
    throw new Error("Not implemented");
  }

  async getCurrentUser(): Promise<User> {
    throw new Error("Not implemented");
  }
}

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

**Step 4: Run test to verify it passes**

```bash
bun run test auth-gateway.test.ts
```

Expected: PASS (2 tests)

**Step 5: Create barrel file**

```typescript
// examples/frontend/simplified-architecture/auth/gateways/index.ts
export type { AuthGateway, LoginRequest, LoginResponse } from "./auth-gateway";
export { AuthHttpGateway, AuthFakeGateway } from "./auth-gateway";
```

**Step 6: Commit**

```bash
git add examples/frontend/simplified-architecture/auth/gateways/
git commit -m "feat(auth): add AuthGateway with tests

- Create AuthGateway interface
- Implement AuthHttpGateway (stub) and AuthFakeGateway
- Add unit tests for AuthFakeGateway
- All tests passing"
```

---

## Task 5: Create Auth Store (TDD)

**Files:**

- Create: `examples/frontend/simplified-architecture/auth/stores/auth-store.ts`
- Create: `examples/frontend/simplified-architecture/auth/stores/auth-store.test.ts`
- Create: `examples/frontend/simplified-architecture/auth/stores/index.ts`

**Step 1: Write the failing test**

```typescript
// examples/frontend/simplified-architecture/auth/stores/auth-store.test.ts
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
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set user and mark as authenticated", () => {
    const user = {
      id: "1",
      name: "Test",
      email: "test@example.com",
      role: "user" as const,
    };

    useAuthStore.getState().setUser(user);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should reset to initial state", () => {
    const user = {
      id: "1",
      name: "Test",
      email: "test@example.com",
      role: "user" as const,
    };
    useAuthStore.getState().setUser(user);

    useAuthStore.getState().reset();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd examples/frontend/simplified-architecture/auth/stores/
bun run test auth-store.test.ts
```

Expected: FAIL with "useAuthStore is not defined" or "Zustand not installed"

**Step 3: Install Zustand (if needed)**

```bash
cd examples/frontend/simplified-architecture/
bun add zustand
```

**Step 4: Write minimal store implementation**

```typescript
// examples/frontend/simplified-architecture/auth/stores/auth-store.ts
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

**Step 5: Run test to verify it passes**

```bash
bun run test auth-store.test.ts
```

Expected: PASS (3 tests)

**Step 6: Create barrel file**

```typescript
// examples/frontend/simplified-architecture/auth/stores/index.ts
export { useAuthStore } from "./auth-store";
```

**Step 7: Commit**

```bash
git add examples/frontend/simplified-architecture/auth/stores/
git add examples/frontend/simplified-architecture/package.json
git add examples/frontend/simplified-architecture/bun.lockb
git commit -m "feat(auth): add Zustand AuthStore with tests

- Create useAuthStore with user, isAuthenticated, isLoading, error
- Add setUser, setLoading, setError, reset actions
- Add unit tests (3 tests passing)
- Install Zustand dependency"
```

---

## Task 6: Create Gateway Provider (Context API)

**Files:**

- Create: `examples/frontend/simplified-architecture/app/providers/gateway-provider.tsx`
- Create: `examples/frontend/simplified-architecture/app/providers/index.ts`

**Step 1: Create GatewayProvider**

```typescript
// examples/frontend/simplified-architecture/app/providers/gateway-provider.tsx
import { createContext, useContext, type ReactNode } from "react";
import { AuthGateway, AuthHttpGateway } from "../../auth/gateways/auth-gateway";

interface Gateways {
  authGateway: AuthGateway;
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

**Step 2: Create barrel file**

```typescript
// examples/frontend/simplified-architecture/app/providers/index.ts
export { GatewayProvider, useGateways } from "./gateway-provider";
```

**Step 3: Verify TypeScript compiles**

```bash
cd examples/frontend/simplified-architecture/app/providers/
bun tsc --noEmit gateway-provider.tsx
```

Expected: No errors (or install React types if needed)

**Step 4: Install React types if needed**

```bash
cd examples/frontend/simplified-architecture/
bun add -d @types/react @types/react-dom
```

**Step 5: Commit**

```bash
git add examples/frontend/simplified-architecture/app/
git commit -m "feat(app): add GatewayProvider for dependency injection

- Create GatewayProvider with Context API
- Add useGateways hook
- Support gateway override for testing
- Add React types"
```

---

## Task 7: Create Login Page (Integration Test with Fake Gateway)

**Files:**

- Create: `examples/frontend/simplified-architecture/auth/pages/login-page.tsx`
- Create: `examples/frontend/simplified-architecture/auth/pages/login-page.test.tsx`
- Create: `examples/frontend/simplified-architecture/auth/pages/index.ts`

**Step 1: Write the failing integration test**

```typescript
// examples/frontend/simplified-architecture/auth/pages/login-page.test.tsx
import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GatewayProvider } from "../../app/providers/gateway-provider";
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
      expect(useAuthStore.getState().user?.email).toBe("test@example.com");
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
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
```

**Step 2: Install testing dependencies**

```bash
cd examples/frontend/simplified-architecture/
bun add -d @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

**Step 3: Run test to verify it fails**

```bash
cd examples/frontend/simplified-architecture/auth/pages/
bun run test login-page.test.tsx
```

Expected: FAIL with "LoginPage is not defined"

**Step 4: Write minimal LoginPage implementation**

```typescript
// examples/frontend/simplified-architecture/auth/pages/login-page.tsx
import { useState } from "react";
import { useGateways } from "../../app/providers/gateway-provider";
import { useAuthStore } from "../stores/auth-store";

export function LoginPage() {
  const { authGateway } = useGateways();
  const { setUser, setLoading, setError, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormError(null);

    try {
      const { user, token } = await authGateway.login({ email, password });
      localStorage.setItem("auth_token", token);
      setUser(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
        </div>

        {formError && <p>{formError}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
```

**Step 5: Run test to verify it passes**

```bash
bun run test login-page.test.tsx
```

Expected: PASS (2 tests)

**Step 6: Create barrel file**

```typescript
// examples/frontend/simplified-architecture/auth/pages/index.ts
export { LoginPage } from "./login-page";
```

**Step 7: Commit**

```bash
git add examples/frontend/simplified-architecture/auth/pages/
git add examples/frontend/simplified-architecture/package.json
git add examples/frontend/simplified-architecture/bun.lockb
git commit -m "feat(auth): add LoginPage with integration tests

- Create LoginPage that orchestrates gateway + store
- Add integration tests with AuthFakeGateway
- Tests verify successful login and error handling
- All tests passing (2 tests)"
```

---

## Task 8: Create Login Form Component (Unit Test)

**Files:**

- Create: `examples/frontend/simplified-architecture/auth/components/login-form.tsx`
- Create: `examples/frontend/simplified-architecture/auth/components/login-form.test.tsx`
- Create: `examples/frontend/simplified-architecture/auth/components/index.ts`

**Step 1: Write the failing component test**

```typescript
// examples/frontend/simplified-architecture/auth/components/login-form.test.tsx
import { describe, it, expect, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("should render email and password fields", () => {
    render(<LoginForm onSubmit={mock()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
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

  it("should disable button when isLoading is true", () => {
    render(<LoginForm onSubmit={mock()} isLoading={true} />);

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });

  it("should show error message when provided", () => {
    render(<LoginForm onSubmit={mock()} error="Invalid credentials" />);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd examples/frontend/simplified-architecture/auth/components/
bun run test login-form.test.tsx
```

Expected: FAIL with "LoginForm is not defined"

**Step 3: Write minimal LoginForm component**

```typescript
// examples/frontend/simplified-architecture/auth/components/login-form.tsx
import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          aria-label="Email"
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          aria-label="Password"
        />
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
```

**Step 4: Run test to verify it passes**

```bash
bun run test login-form.test.tsx
```

Expected: PASS (4 tests)

**Step 5: Create barrel file**

```typescript
// examples/frontend/simplified-architecture/auth/components/index.ts
export { LoginForm } from "./login-form";
```

**Step 6: Commit**

```bash
git add examples/frontend/simplified-architecture/auth/components/
git commit -m "feat(auth): add LoginForm component with unit tests

- Create pure UI LoginForm component
- Add unit tests (4 tests passing)
- Tests verify rendering, submission, loading state, error display
- Component receives props, emits events (no store/gateway access)"
```

---

## Task 9: Refactor LoginPage to Use LoginForm Component

**Files:**

- Modify: `examples/frontend/simplified-architecture/auth/pages/login-page.tsx`

**Step 1: Update LoginPage to use LoginForm**

```typescript
// examples/frontend/simplified-architecture/auth/pages/login-page.tsx
import { useState } from "react";
import { useGateways } from "../../app/providers/gateway-provider";
import { useAuthStore } from "../stores/auth-store";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  const { authGateway } = useGateways();
  const { setUser, setLoading, setError, isLoading } = useAuthStore();
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setFormError(null);

    try {
      const { user, token } = await authGateway.login({ email, password });
      localStorage.setItem("auth_token", token);
      setUser(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={formError}
      />
    </div>
  );
}
```

**Step 2: Run existing tests to verify they still pass**

```bash
cd examples/frontend/simplified-architecture/auth/pages/
bun run test login-page.test.tsx
```

Expected: PASS (2 tests)

**Step 3: Commit**

```bash
git add examples/frontend/simplified-architecture/auth/pages/login-page.tsx
git commit -m "refactor(auth): use LoginForm component in LoginPage

- Extract UI into LoginForm component
- LoginPage now focuses on orchestration only
- All integration tests still passing"
```

---

## Task 10: Create README Documentation

**Files:**

- Create: `examples/frontend/simplified-architecture/README.md`

**Step 1: Create comprehensive README**

```markdown
# Simplified Frontend Architecture Example

This example demonstrates the simplified, pragmatic frontend architecture that replaces Clean Architecture complexity.

## Architecture Overview

**Philosophy:** Simplicity and pragmatism over architectural purity.

**Structure per feature:**
```

features/[name]/
├── components/ # Pure UI components (< 150 lines)
├── pages/ # Use cases - orchestrate logic
├── stores/ # Zustand stores (framework-agnostic, testable)
├── gateways/ # Interface + HTTP + Fake (injected via Context API)
├── hooks/ # Custom hooks (optional)
└── types/ # TypeScript types

```

**Key Principles:**

1. **Feature-based organization** - All related code in one place
2. **Pages as use cases** - Pages orchestrate gateways + stores
3. **Externalized state** - Zustand stores are 100% testable without React
4. **Gateway injection** - Context API for dependency injection, enables isolated testing
5. **YAGNI** - No domain/application/infrastructure/presentation layers

## Example: Auth Feature

### Directory Structure

```

auth/
├── components/
│ ├── login-form.tsx # Pure UI component
│ ├── login-form.test.tsx # Unit tests
│ └── index.ts
├── pages/
│ ├── login-page.tsx # Orchestrates gateway + store
│ ├── login-page.test.tsx # Integration tests with fake gateway
│ └── index.ts
├── stores/
│ ├── auth-store.ts # Zustand store (testable without React)
│ ├── auth-store.test.ts # Unit tests
│ └── index.ts
├── gateways/
│ ├── auth-gateway.ts # Interface + HTTP + Fake
│ ├── auth-gateway.test.ts # Unit tests
│ └── index.ts
└── types/
├── user.ts
└── index.ts

````

### Testing Strategy

**1. Store Tests (Unit - High Priority)**

Zustand stores are 100% testable without React:

```typescript
import { useAuthStore } from './auth-store';

describe('AuthStore', () => {
  it('should set user', () => {
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
````

**2. Page Tests (Integration with Fake Gateways)**

Test orchestration with injected fakes:

```typescript
import { GatewayProvider } from "@/app/providers";
import { AuthFakeGateway } from "../gateways/auth-gateway";

const fakeGateway = new AuthFakeGateway();

render(
  <GatewayProvider gateways={{ authGateway: fakeGateway }}>
    <LoginPage />
  </GatewayProvider>
);
```

**3. Component Tests (Unit - Pure UI)**

Test rendering without stores or gateways:

```typescript
import { LoginForm } from "./login-form";

it("should call onSubmit", async () => {
  const onSubmit = mock();
  render(<LoginForm onSubmit={onSubmit} />);
  // ... interact and verify
});
```

## Running Tests

```bash
# All tests
bun run test

# Specific test file
bun run test auth-store.test.ts

# Watch mode
bun run test --watch
```

## Key Differences from Clean Architecture

| Aspect         | Clean Architecture                                 | Simplified Architecture              |
| -------------- | -------------------------------------------------- | ------------------------------------ |
| **Layers**     | 4 (domain/application/infrastructure/presentation) | 0 (flat per feature)                 |
| **Use Cases**  | Separate classes in application/                   | Pages orchestrate logic              |
| **State**      | TanStack Store in presentation/                    | Zustand stores/ (framework-agnostic) |
| **DI**         | Manual instantiation                               | Context API (GatewayProvider)        |
| **Testing**    | Mock layers                                        | Mock gateways only                   |
| **Complexity** | High (many abstractions)                           | Low (direct code)                    |

## References

- **Design Doc:** `docs/plans/2025-10-24-simplified-frontend-architecture-design.md`
- **Skills:** `plugins/architecture-design/skills/frontend-engineer/SKILL.md`
- **Audit:** `plugins/architecture-design/skills/architecture-auditor/SKILL.md`

````

**Step 2: Commit**

```bash
git add examples/frontend/simplified-architecture/README.md
git commit -m "docs: add comprehensive README for simplified architecture example

- Document architecture overview and principles
- Explain feature structure and testing strategy
- Provide comparison with Clean Architecture
- Include references to design docs and skills"
````

---

## Task 11: Run Quality Gates

**Files:**

- Verify: All TypeScript compiles, tests pass

**Step 1: Run format check**

```bash
cd examples/frontend/simplified-architecture/
bun run format
```

Expected: All files formatted

**Step 2: Run type check**

```bash
bun run type-check
```

Expected: No TypeScript errors

**Step 3: Run all tests**

```bash
bun run test
```

Expected: All tests passing

- auth-store.test.ts: 3 tests ✓
- auth-gateway.test.ts: 2 tests ✓
- login-page.test.tsx: 2 tests ✓
- login-form.test.tsx: 4 tests ✓
- **Total: 11 tests passing**

**Step 4: Commit if any fixes needed**

```bash
git add .
git commit -m "chore: pass quality gates

- Format code with Biome
- Fix TypeScript errors
- All tests passing (11/11)"
```

---

## Task 12: Final Validation

**Files:**

- Verify: Design doc, skills, example are all consistent

**Step 1: Compare design doc with implementation**

```bash
# Check design doc mentions Zustand
grep -i "zustand" docs/plans/2025-10-24-simplified-frontend-architecture-design.md

# Check example uses Zustand
grep -r "from 'zustand'" examples/frontend/simplified-architecture/
```

Expected: Both use Zustand (NOT TanStack Store)

**Step 2: Compare skills with implementation**

```bash
# Check frontend-engineer skill mentions simplified architecture
grep -A 5 "simplified.*architecture" plugins/architecture-design/skills/frontend-engineer/SKILL.md

# Check example structure matches skill
ls examples/frontend/simplified-architecture/auth/
```

Expected: Structure matches (pages/, components/, stores/, gateways/)

**Step 3: Run architecture auditor validation (if available)**

```bash
# Invoke architecture-auditor skill on example
# This would be done manually with Claude
```

Expected: Example passes all frontend architecture checks

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: validate design doc, skills, and example consistency

- Design doc, frontend-engineer skill, architecture-auditor skill all aligned
- Example auth feature matches documented patterns
- All tests passing, quality gates passed
- Ready for production use"
```

---

## Summary

**Deliverables Created:**

1. ✅ Updated global CLAUDE.md with simplified architecture
2. ✅ Created complete auth example feature with:
   - Types (User)
   - Gateway (interface + HTTP + Fake) with tests
   - Store (Zustand) with tests
   - Page (LoginPage) with integration tests
   - Component (LoginForm) with unit tests
   - GatewayProvider (Context API)
3. ✅ Comprehensive README documentation
4. ✅ All quality gates passed (format, type-check, tests)

**Test Coverage:**

- 11 tests total
- 100% coverage of example code
- Unit tests: stores, gateways, components
- Integration tests: pages with fake gateways

**Next Steps:**

1. Use this example as template for new features
2. Migrate existing features gradually (if needed)
3. Update project-specific CLAUDE.md files
4. Train team on new architecture patterns

---

**Plan Complete!**

Total estimated time: **2-3 hours** (assuming dependencies installed, React setup exists)

Reference: @frontend-engineer @architecture-auditor @clean-architecture
