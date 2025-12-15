# Redux Toolkit Guide - Hotel Booking Management Project

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Installation & Setup](#2-installation--setup)
- [3. Creating Slices](#3-creating-slices)
- [4. Store Configuration](#4-store-configuration)
- [5. Using Redux in Components](#5-using-redux-in-components)
- [6. Async Actions with createAsyncThunk](#6-async-actions-with-createasyncthunk)
- [7. Common Patterns in This Project](#7-common-patterns-in-this-project)

---

## 1. Introduction

### What is Redux Toolkit?

Redux Toolkit (RTK) is the official, opinionated, batteries-included toolset for efficient Redux development. It simplifies Redux by reducing boilerplate code and providing best practices out of the box.

### Why Use Redux Toolkit?

- **Less Boilerplate**: Write less code with `createSlice` and `createAsyncThunk`
- **Immer Built-in**: Mutate state directly (it's handled safely under the hood)
- **Better DevTools**: Enhanced Redux DevTools integration
- **TypeScript Support**: Excellent TypeScript support with type inference
- **Best Practices**: Enforces Redux best practices automatically
- **Simplified Store Setup**: `configureStore` with sensible defaults

### Version Used

This project uses **@reduxjs/toolkit v2.6.1** and **react-redux v9.2.0**.

---

## 2. Installation & Setup

### Step 1: Install Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

### Step 2: Create the Store

Create a store using `configureStore` which includes Redux DevTools and thunk middleware by default.

**File: `store/store.ts`**

```tsx
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import hotelReducer from "@/features/hotel/hotelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Step 3: Create Typed Hooks

Create typed versions of `useDispatch` and `useSelector` hooks for better TypeScript support.

**File: `store/hooks.ts`**

```tsx
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Step 4: Wrap Your App with Provider

Wrap your application with the Redux `Provider` component.

**File: `main.tsx`**

```tsx
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
```

> **💡 Tip**: Place `Provider` as high as possible in your component tree, typically at the root level.

---

## 3. Creating Slices

### Basic Slice Structure

A slice contains reducer logic and actions for a specific feature. Use `createSlice` to define reducers and actions together.

**File: `features/auth/authSlice.ts`**

```tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
```

**Key Concepts:**

- `name`: Prefix for action types (e.g., `"auth/setUser"`)
- `initialState`: Starting state for this slice
- `reducers`: Object of reducer functions
- `PayloadAction<T>`: Type for action payloads

### Mutating State Directly

With Redux Toolkit, you can write "mutating" logic in reducers. Immer handles creating immutable updates.

```tsx
reducers: {
  setUser: (state, action: PayloadAction<User>) => {
    // This looks like mutation, but Immer makes it immutable
    state.user = action.payload;
    state.isAuthenticated = true;
  },
}
```

### Real Example: Hotel Slice

**File: `features/hotel/hotelSlice.ts`**

```tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel } from "@/types/hotel";

interface HotelState {
  currentHotel: Hotel | null;
}

const initialState: HotelState = {
  currentHotel: localStorage.getItem("currentHotel")
    ? JSON.parse(localStorage.getItem("currentHotel")!)
    : null,
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setCurrentHotel: (state, action: PayloadAction<Hotel>) => {
      state.currentHotel = action.payload;
      // Persist to localStorage
      localStorage.setItem("currentHotel", JSON.stringify(action.payload));
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
      localStorage.removeItem("currentHotel");
    },
  },
});

export const { setCurrentHotel, clearCurrentHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
```

### Accessing Other Slices

You can access and dispatch actions from other slices:

```tsx
import { clearCurrentHotel } from "../hotel/hotelSlice";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
```

---

## 4. Store Configuration

### Basic Store Setup

The store is configured with all reducers combined.

**File: `store/store.ts`**

```tsx
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import hotelReducer from "@/features/hotel/hotelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**What `configureStore` includes:**

- Redux DevTools Extension support
- Redux Thunk middleware for async actions
- Development checks for common mistakes
- Default middleware stack

### TypeScript Types

Export types for use throughout your application:

```tsx
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 5. Using Redux in Components

### Reading State with useAppSelector

Use the typed `useAppSelector` hook to read state from the store.

**Basic Example:**

```tsx
import { useAppSelector } from "@/store/hooks";

const MyComponent = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return <div>Welcome, {user?.name}</div>;
};
```

**Real Example: PrivateRoute Component**

**File: `components/routes/PrivateRoute.tsx`**

```tsx
import { useAppSelector } from "@/store/hooks";

const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
```

**Real Example: HotelDetailPage**

**File: `pages/user/HotelDetailPage.tsx`**

```tsx
import { useAppSelector } from "@/store/hooks";

const HotelDetailPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div>
      {isAuthenticated ? (
        <button>Book Now</button>
      ) : (
        <button>Login to Book</button>
      )}
    </div>
  );
};
```

### Dispatching Actions with useAppDispatch

Use the typed `useAppDispatch` hook to dispatch actions.

**Basic Example:**

```tsx
import { useAppDispatch } from "@/store/hooks";
import { setUser, resetAuth } from "@/features/auth/authSlice";

const MyComponent = () => {
  const dispatch = useAppDispatch();

  const handleLogin = (userData: User) => {
    dispatch(setUser(userData));
  };

  const handleLogout = () => {
    dispatch(resetAuth());
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
```

**Real Example: LoginPage**

**File: `pages/auth/LoginPage.tsx`**

```tsx
import { useAppDispatch } from "@/store/hooks";
import { setUser, resetAuth } from "@/features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await authApi.login(data.email, data.password);
    },
    onSuccess: async (response) => {
      if (response.success) {
        const userResponse = await authApi.getMe();
        if (userResponse.success) {
          // Dispatch action to update Redux state
          dispatch(setUser(userResponse.data));
          toast.success("Login successful");
          navigate("/");
        }
      }
    },
  });

  return <form>...</form>;
};
```

### Selecting Multiple Values

You can select multiple values efficiently:

```tsx
// Option 1: Multiple selectors
const user = useAppSelector((state) => state.auth.user);
const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

// Option 2: Single selector (more efficient)
const { user, isAuthenticated } = useAppSelector((state) => state.auth);

// Option 3: Memoized selector (for complex computations)
const userRole = useAppSelector(
  (state) => state.auth.user?.role,
  (a, b) => a === b
);
```

---

## 6. Async Actions with createAsyncThunk

### What is createAsyncThunk?

`createAsyncThunk` is a helper function that generates action creators for async operations. It handles the pending, fulfilled, and rejected states automatically.

### Basic Async Thunk

**File: `features/auth/authSlice.ts`**

```tsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth/auth.api";
import { queryClient } from "@/lib/react-query";

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authApi.logout();

      // Dispatch other actions
      dispatch(resetAuth());
      dispatch(clearCurrentHotel());

      // Clear React Query cache
      queryClient.clear();

      return { success: true };
    } catch (error) {
      // Handle error
      dispatch(resetAuth());
      dispatch(clearCurrentHotel());
      queryClient.clear();
      throw error;
    }
  }
);
```

### Handling Async Thunk States

Add `extraReducers` to handle async thunk states:

```tsx
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        // Handle pending state
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        // Handle success
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        // Handle error
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});
```

**Real Example: Logout Async Thunk**

**File: `features/auth/authSlice.ts`**

```tsx
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { queryClient } from "@/lib/react-query";
import { authApi } from "@/api/auth/auth.api";
import { clearCurrentHotel } from "../hotel/hotelSlice";

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authApi.logout();

      // Dispatch synchronous actions
      dispatch(resetAuth());
      dispatch(clearCurrentHotel());

      // Clear React Query cache
      queryClient.clear();

      return { success: true };
    } catch (error) {
      // Even on error, reset local state
      if (error instanceof AxiosError) {
        console.error("Logout error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      }

      dispatch(resetAuth());
      dispatch(clearCurrentHotel());
      queryClient.clear();

      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
```

### Using Async Thunks in Components

```tsx
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";

const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

---

## 7. Common Patterns in This Project

### Pattern 1: Authentication State Management

```tsx
// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Component
const { user, isAuthenticated } = useAppSelector((state) => state.auth);
const dispatch = useAppDispatch();

dispatch(setUser(userData));
dispatch(resetAuth());
```

### Pattern 2: Persisting State to localStorage

```tsx
const hotelSlice = createSlice({
  name: "hotel",
  initialState: {
    currentHotel: localStorage.getItem("currentHotel")
      ? JSON.parse(localStorage.getItem("currentHotel")!)
      : null,
  },
  reducers: {
    setCurrentHotel: (state, action: PayloadAction<Hotel>) => {
      state.currentHotel = action.payload;
      localStorage.setItem("currentHotel", JSON.stringify(action.payload));
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
      localStorage.removeItem("currentHotel");
    },
  },
});
```

### Pattern 3: Integrating with React Query

```tsx
import { queryClient } from "@/lib/react-query";

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    await authApi.logout();
    dispatch(resetAuth());
    // Clear React Query cache
    queryClient.clear();
  }
);
```

### Pattern 4: Cross-Slice Actions

```tsx
import { clearCurrentHotel } from "../hotel/hotelSlice";

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    await authApi.logout();
    dispatch(resetAuth());
    dispatch(clearCurrentHotel()); // Dispatch action from another slice
    queryClient.clear();
  }
);
```

### Pattern 5: Type-Safe Selectors

```tsx
// Store hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage
const user = useAppSelector((state) => state.auth.user); // Fully typed!
const dispatch = useAppDispatch(); // Fully typed!
```

---

## Troubleshooting

### State Not Updating

**Problem**: Component doesn't re-render when state changes

**Solutions**:

- ✅ Ensure component is wrapped in `Provider`
- ✅ Check selector is selecting the correct state slice
- ✅ Verify action is being dispatched correctly
- ✅ Check Redux DevTools to see if action was dispatched

### TypeScript Errors

**Problem**: Type errors with selectors or dispatch

**Solutions**:

- ✅ Use typed hooks (`useAppSelector`, `useAppDispatch`)
- ✅ Export `RootState` and `AppDispatch` types from store
- ✅ Use `PayloadAction<T>` for action types
- ✅ Check slice name matches reducer key in store

### Actions Not Working

**Problem**: Actions don't update state

**Solutions**:

- ✅ Verify action is exported from slice
- ✅ Check action is imported correctly
- ✅ Ensure reducer is registered in store
- ✅ Check action type matches slice name

### Async Actions Failing

**Problem**: Async thunk doesn't work

**Solutions**:

- ✅ Ensure thunk returns a promise
- ✅ Handle errors properly in catch block
- ✅ Check `extraReducers` handles all thunk states
- ✅ Verify thunk is dispatched correctly

---

## Summary

Redux Toolkit simplifies Redux development with less boilerplate and better developer experience. Key takeaways:

1. **configureStore** sets up store with best practices
2. **createSlice** combines reducers and actions
3. **createAsyncThunk** handles async operations
4. **Typed hooks** provide TypeScript support
5. **Immer** allows direct state mutations safely

### Common Hooks

#### useAppSelector

Read state from store.

```tsx
const user = useAppSelector((state) => state.auth.user);
const { user, isAuthenticated } = useAppSelector((state) => state.auth);
```

#### useAppDispatch

Dispatch actions to store.

```tsx
const dispatch = useAppDispatch();
dispatch(setUser(userData));
dispatch(logout());
```

### Common Patterns

#### Creating a Slice

```tsx
const mySlice = createSlice({
  name: "myFeature",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Data>) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = mySlice.actions;
export default mySlice.reducer;
```

#### Async Thunk

```tsx
export const fetchData = createAsyncThunk(
  "myFeature/fetchData",
  async (id: string, { dispatch }) => {
    const data = await api.getData(id);
    return data;
  }
);
```

This project demonstrates a production-ready Redux Toolkit setup with proper TypeScript support, async actions, and integration with React Query.

---

## Additional Resources

- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [Redux Toolkit TypeScript Guide](https://redux-toolkit.js.org/usage/usage-with-typescript)
- [Redux Toolkit Examples](https://github.com/reduxjs/redux-toolkit/tree/master/examples)
