# React Router v7.3 Guide - Hotel Booking Management Project

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Installation & Setup](#2-installation--setup)
- [3. Basic Routing & Nested Routes](#3-basic-routing--nested-routes)
- [4. Dynamic Routes & Parameters](#4-dynamic-routes--parameters)
- [5. Navigation](#5-navigation)
- [6. Route Protection](#6-route-protection)
- [7. Advanced Patterns](#7-advanced-patterns)
- [8. Common Hooks](#8-common-hooks)
- [9. Routing Flow](#9-routing-flow)
- [10. Best Practices](#10-best-practices)

---

## 1. Introduction

### What is React Router?

React Router is a powerful routing library for React applications that enables client-side routing. Unlike traditional multi-page applications, React Router allows you to build single-page applications (SPAs) where navigation happens without full page reloads.

### Why Use React Router?

- **Better UX**: Instant navigation without page reloads
- **URL Management**: Maintains browser history and shareable URLs
- **Code Splitting**: Easy to implement lazy loading for routes
- **Nested Routing**: Organize complex UI hierarchies
- **Route Protection**: Control access based on authentication/authorization

### Version Used

This project uses **React Router v7.3.0**.

---

## 2. Installation & Setup

### Step 1: Install React Router

```bash
npm install react-router@^7.3.0
```

### Step 2: Wrap Your App with BrowserRouter

The `BrowserRouter` component enables routing functionality throughout your application. It should wrap your entire app at the root level.

**File: `main.tsx`**

```tsx
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

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

> **💡 Tip**: `BrowserRouter` uses HTML5 history API. For static hosting, you might need `HashRouter` instead.

---

## 3. Basic Routing & Nested Routes

### Routes and Route Components

The `Routes` component acts as a container for all your routes, and `Route` defines individual route mappings.

**File: `App.tsx`**

```tsx
import { Route, Routes } from "react-router";
import HomePage from "./pages/user/HomePage";
import AboutPage from "./pages/user/AboutPage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
```

**Key Concepts:**

- `index` route: The default route when path matches exactly `/`
- `path` prop: Defines the URL pattern
- `element` prop: The component to render when the route matches

### Route Matching

Routes are matched from top to bottom. The first matching route is rendered.

```tsx
<Routes>
  <Route path="/hotels" element={<HotelsList />} />
  <Route path="/hotels/:id" element={<HotelDetail />} />
  <Route path="*" element={<NotFound />} /> {/* Catch-all */}
</Routes>
```

> **⚠️ Important**: The catch-all route (`path="*"`) must be placed last, otherwise it will match all routes.

### Understanding Nested Routes

Nested routes allow you to create route hierarchies where child routes render within parent route components. This is perfect for layouts.

### The Outlet Component

`Outlet` is a placeholder that renders child routes. Think of it as `<Outlet />` = "render child routes here".

**File: `layouts/UserLayout.tsx`**

```tsx
import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  );
};
```

### Implementing Nested Routes

**File: `App.tsx`**

```tsx
<Routes>
  {/* Public Routes with Layout */}
  <Route element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/search" element={<SearchResultPage />} />
  </Route>
</Routes>
```

**How it works:**

1. User navigates to `/about`
2. `Layout` component renders (Header + Footer)
3. `Outlet` renders `<AboutPage />` in the main section
4. Result: Header + AboutPage + Footer

### Multiple Layouts

You can have different layouts for different sections:

```tsx
<Routes>
  {/* User Layout */}
  <Route element={<UserLayout />}>
    <Route path="/" element={<HomePage />} />
  </Route>

  {/* Partner Layout */}
  <Route path="/partner" element={<PartnerLayout />}>
    <Route path="revenue" element={<RevenuePage />} />
    <Route path="hotels/info" element={<HotelInfoPage />} />
  </Route>

  {/* Admin Layout */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<DashboardPage />} />
  </Route>
</Routes>
```

> **💡 Tip**: Notice how nested routes inherit the parent path. `/partner/revenue` means the parent is `/partner` and child is `revenue`.

---

## 4. Dynamic Routes & Parameters

### Route Parameters

Dynamic segments in URLs are defined with `:paramName`. Use `useParams` hook to access them.

**Defining Dynamic Routes:**

```tsx
<Route path="/hoteldetail/:id" element={<HotelDetailPage />} />
<Route path="/blog/:id" element={<BlogDetailPage />} />
<Route path="/verify-email/:token" element={<VerifyEmailPage />} />
```

**Accessing Parameters:**

**File: `pages/user/HotelDetailPage.tsx`**

```tsx
import { useParams } from "react-router";

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // Use id to fetch hotel data
  const { data: hotel } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => hotelApi.getHotel(id as string),
  });

  return <div>Hotel ID: {id}</div>;
};
```

**TypeScript Tip:** Use generic type for `useParams` to get type safety:

```tsx
const { id, roomId } = useParams<{ id: string; roomId: string }>();
```

### Query Parameters

Query parameters (`?key=value`) are accessed using `useSearchParams` hook.

**File: `pages/user/SearchResultPage.tsx`**

```tsx
import { useSearchParams } from "react-router";

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get query params
  const locationName = searchParams.get("locationName") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const capacity = Number(searchParams.get("capacity")) || 1;

  // Update query params
  const handleFilterChange = (newFilter: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), filter: newFilter });
  };

  return <div>Searching for: {locationName}</div>;
};
```

**Common Patterns:**

```tsx
// Get single param
const page = searchParams.get("page");

// Get all params as object
const allParams = Object.fromEntries(searchParams);

// Set params
setSearchParams({ page: "2", sort: "price" });

// Update existing params
setSearchParams({ ...Object.fromEntries(searchParams), page: "3" });
```

---

## 5. Navigation

### Link Component

Use `Link` instead of `<a>` tags for internal navigation. It prevents full page reloads.

**File: `components/layout/Header.tsx`**

```tsx
import { Link } from "react-router";

const Header = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/hoteldetail/123">Hotel Detail</Link>
    </nav>
  );
};
```

**Benefits:**

- No page reload
- Maintains React state
- Faster navigation
- Better UX

### useNavigate Hook

For programmatic navigation (e.g., after form submission, button click), use `useNavigate`.

**File: `pages/user/NotFoundPage.tsx`**

```tsx
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};
```

**Navigation Options:**

```tsx
// Navigate to a route
navigate("/about");

// Navigate with replace (no history entry)
navigate("/login", { replace: true });

// Navigate back/forward
navigate(-1); // Go back
navigate(1); // Go forward

// Navigate with state
navigate("/detail", { state: { hotelId: 123 } });
```

**Real Example: Search Navigation**

**File: `pages/user/HomePage.tsx`**

```tsx
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (searchParams: {
    locationName: string;
    checkIn: string;
    checkOut: string;
    capacity: number;
  }) => {
    const params = new URLSearchParams();
    params.append("locationName", searchParams.locationName);
    params.append("checkIn", searchParams.checkIn);
    params.append("checkOut", searchParams.checkOut);
    params.append("capacity", searchParams.capacity.toString());

    navigate(`/search?${params.toString()}`);
  };

  return <SearchBox onSearch={handleSearch} />;
};
```

### useLocation Hook

Access current location information, including state passed during navigation.

**File: `components/routes/PrivateRoute.tsx`**

```tsx
import { useLocation } from "react-router";

const PrivateRoute = () => {
  const location = useLocation();

  // Get current pathname
  const currentPath = location.pathname;

  // Get state from navigation
  const state = location.state;

  return <div>Current path: {currentPath}</div>;
};
```

**Passing State Example:**

```tsx
// Navigate with state
navigate("/admin/partners/123", {
  state: { partner: partnerData },
});

// Access state in destination component
const location = useLocation();
const partner = location.state?.partner;
```

---

## 6. Route Protection

### Why Protect Routes?

Not all routes should be accessible to everyone. You need to:

- Prevent unauthorized access
- Redirect unauthenticated users
- Enforce role-based access control

### PrivateRoute Component

A wrapper component that checks authentication before rendering child routes.

**File: `components/routes/PrivateRoute.tsx`**

```tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/store/hooks";

interface PrivateRouteProps {
  role: "user" | "admin" | "partner";
  allowMultipleRoles?: boolean;
}

const PrivateRoute = ({
  role,
  allowMultipleRoles = false,
}: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (!allowMultipleRoles && user?.role !== role) {
    // Redirect based on user role
    switch (user?.role) {
      case "admin":
        return <Navigate to="/admin/partners" replace />;
      case "partner":
        return <Navigate to="/partner/hotels/info" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Allow access
  return <Outlet />;
};
```

**Usage in App.tsx:**

```tsx
<Routes>
  {/* Protected User Routes */}
  <Route element={<PrivateRoute role="user" />}>
    <Route element={<Layout />}>
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/bookings" element={<MyBookingPage />} />
    </Route>
  </Route>

  {/* Protected Admin Routes */}
  <Route element={<PrivateRoute role="admin" />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="partners" element={<PartnerApproval />} />
    </Route>
  </Route>

  {/* Shared Routes (multiple roles) */}
  <Route element={<PrivateRoute role="user" allowMultipleRoles={true} />}>
    <Route path="/favourite-hotels" element={<FavouriteHotelPage />} />
  </Route>
</Routes>
```

### PublicRoute Component

Routes that should only be accessible when NOT authenticated (e.g., login, register).

**File: `components/routes/PublicRoute.tsx`**

```tsx
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/store/hooks";

const PublicRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If authenticated, redirect to home
  // Otherwise, render child routes
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
```

**Usage:**

```tsx
<Route element={<PublicRoute />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
</Route>
```

### Navigate Component

The `Navigate` component immediately redirects when rendered. Useful in route guards.

```tsx
// Redirect to login
<Navigate to="/login" replace />

// Redirect with state
<Navigate to="/dashboard" state={{ from: location.pathname }} />
```

---

## 7. Advanced Patterns

### Complete Route Structure

Here's how a real application organizes routes:

**File: `App.tsx` (Simplified)**

```tsx
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/hoteldetail/:id" element={<HotelDetailPage />} />
      </Route>

      {/* Auth Routes - Only when NOT logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* User Routes - Requires user role */}
      <Route element={<PrivateRoute role="user" />}>
        <Route element={<Layout />}>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/bookings" element={<MyBookingPage />} />
        </Route>
      </Route>

      {/* Partner Routes - Requires partner role */}
      <Route element={<PrivateRoute role="partner" />}>
        <Route path="/partner" element={<PartnerLayout />}>
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="hotels/info" element={<HotelInfoPage />} />
        </Route>
      </Route>

      {/* Admin Routes - Requires admin role */}
      <Route element={<PrivateRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="partners" element={<PartnerApproval />} />
        </Route>
      </Route>

      {/* 404 - Must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

### Route Organization Tips

1. **Group by functionality**: Public, Auth, User, Partner, Admin
2. **Use comments**: Document route groups
3. **Order matters**: More specific routes before general ones
4. **404 last**: Catch-all route must be at the end

---

## 8. Common Hooks

### useNavigate

Programmatic navigation.

```tsx
const navigate = useNavigate();

// Navigate
navigate("/about");

// Navigate with replace
navigate("/login", { replace: true });

// Navigate with state
navigate("/detail", { state: { data: 123 } });

// Navigate back/forward
navigate(-1); // back
navigate(1); // forward
```

### useLocation

Access current location.

```tsx
const location = useLocation();

location.pathname; // "/hoteldetail/123"
location.search; // "?checkIn=2024-01-01"
location.state; // State passed via navigate()
location.hash; // "#section"
```

### useParams

Get route parameters.

```tsx
// Route: /hoteldetail/:id
const { id } = useParams<{ id: string }>();

// Route: /booking/:roomId/:hotelId
const { roomId, hotelId } = useParams<{
  roomId: string;
  hotelId: string;
}>();
```

### useSearchParams

Work with query strings.

```tsx
const [searchParams, setSearchParams] = useSearchParams();

// Get
const page = searchParams.get("page");

// Set
setSearchParams({ page: "2", sort: "price" });

// Update
setSearchParams({
  ...Object.fromEntries(searchParams),
  page: "3",
});
```

---

## 9. Routing Flow

### User Journey: Booking a Hotel

```
1. User visits homepage (/)
   └─> Renders: <Layout><HomePage /></Layout>

2. User searches for hotels
   └─> Navigates to: /search?locationName=Hanoi&checkIn=2024-01-01
   └─> Renders: <Layout><SearchResultPage /></Layout>

3. User clicks on a hotel
   └─> Navigates to: /hoteldetail/123?checkIn=2024-01-01
   └─> Renders: <Layout><HotelDetailPage /></Layout>
   └─> useParams() extracts: { id: "123" }
   └─> useSearchParams() extracts: { checkIn: "2024-01-01" }

4. User clicks "Book Now" (not logged in)
   └─> PrivateRoute checks authentication
   └─> Redirects to: /login?redirect=/hoteldetail/123

5. User logs in
   └─> After login, navigates back to: /hoteldetail/123
   └─> PrivateRoute allows access
   └─> Renders: <Layout><BookingInformationPage /></Layout>
```

### Authentication Flow

```
1. Unauthenticated user tries to access /profile
   └─> PrivateRoute checks: isAuthenticated = false
   └─> <Navigate to="/login" replace />
   └─> User sees LoginPage

2. User logs in successfully
   └─> Auth state updated: isAuthenticated = true
   └─> navigate("/profile")
   └─> PrivateRoute checks: isAuthenticated = true, role = "user"
   └─> <Outlet /> renders UserProfilePage

3. User tries to access /admin/dashboard (as regular user)
   └─> PrivateRoute checks: role = "user" !== "admin"
   └─> <Navigate to="/" replace />
   └─> User redirected to homepage
```

### Route Matching Flow

```
URL: /partner/hotels/info

1. React Router checks routes from top to bottom
2. Matches: <Route path="/partner" element={<PartnerLayout />}>
3. Renders PartnerLayout
4. Inside PartnerLayout, <Outlet /> is rendered
5. Router continues matching child routes
6. Matches: <Route path="hotels/info" element={<HotelInfoPage />} />
7. Renders HotelInfoPage inside PartnerLayout's Outlet
8. Final render: PartnerLayout > HotelInfoPage
```

## Troubleshooting

### Routes Not Working

**Problem**: Routes don't render or show 404

**Solutions**:

- ✅ Check if `BrowserRouter` wraps your app
- ✅ Verify route paths match exactly (case-sensitive)
- ✅ Ensure catch-all route (`*`) is last
- ✅ Check for typos in path strings

### Redirect Loops

**Problem**: Infinite redirects

**Solutions**:

- ✅ Check authentication state logic
- ✅ Use `replace` prop in `Navigate`
- ✅ Verify `PublicRoute` doesn't redirect authenticated users incorrectly

### Outlet Not Rendering

**Problem**: Child routes don't appear

**Solutions**:

- ✅ Ensure parent route has `<Outlet />`
- ✅ Check nested route structure
- ✅ Verify route paths are correct

### Params Undefined

**Problem**: `useParams()` returns undefined

**Solutions**:

- ✅ Check route definition includes `:paramName`
- ✅ Verify you're on the correct route
- ✅ Add null checks before using params

---

## Summary

React Router enables powerful client-side routing in React applications. Key takeaways:

1. **BrowserRouter** wraps your app to enable routing
2. **Routes/Route** define your route structure
3. **Outlet** renders nested child routes
4. **Link** replaces `<a>` tags for internal navigation
5. **useNavigate** enables programmatic navigation
6. **useParams** accesses route parameters
7. **useSearchParams** works with query strings
8. **PrivateRoute/PublicRoute** protect routes
9. **Navigate** component handles redirects

This project demonstrates a production-ready routing setup with authentication, role-based access control, nested layouts, and dynamic routes.

---

## Additional Resources

- [React Router Official Docs](https://reactrouter.com/)
- [React Router v7 Migration Guide](https://reactrouter.com/en/main/upgrading/v7)
- [React Router Examples](https://github.com/remix-run/react-router/tree/main/examples)
