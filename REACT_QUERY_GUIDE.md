# React Query v5 Guide - Hotel Booking Management Project

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Installation & Setup](#2-installation--setup)
- [3. Basic Queries](#3-basic-queries)
- [4. Mutations](#4-mutations)
- [5. Query Keys & Cache Management](#5-query-keys--cache-management)
- [6. Advanced Patterns](#6-advanced-patterns)
- [7. Common Patterns in This Project](#7-common-patterns-in-this-project)

---

## 1. Introduction

### What is React Query?

React Query (TanStack Query) is a powerful data-fetching library for React applications. It provides hooks for fetching, caching, synchronizing, and updating server state in your React applications.

### Why Use React Query?

- **Automatic Caching**: Data is cached automatically, reducing unnecessary network requests
- **Background Updates**: Keeps data fresh with background refetching
- **Loading & Error States**: Built-in handling for loading, error, and success states
- **Optimistic Updates**: Update UI before server confirms changes
- **Request Deduplication**: Automatically deduplicates identical requests
- **Pagination & Infinite Queries**: Built-in support for paginated data
- **DevTools**: Excellent debugging tools

### Version Used

This project uses **@tanstack/react-query v5.69.0**.

---

## 2. Installation & Setup

### Step 1: Install React Query

```bash
npm install @tanstack/react-query@^5.69.0
```

### Step 2: Create QueryClient

Create a QueryClient instance with default options.

**File: `lib/react-query.ts`**

```tsx
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed queries once
      staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
      gcTime: 10 * 60 * 1000, // Cache kept for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch when connection restored
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});
```

### Step 3: Wrap Your App with QueryClientProvider

The `QueryClientProvider` makes the QueryClient available throughout your application.

**File: `main.tsx`**

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query.ts";

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

> **💡 Tip**: Place `QueryClientProvider` as high as possible in your component tree, but below other providers that might need it.

---

## 3. Basic Queries

### useQuery Hook

`useQuery` is used to fetch data from an API. It returns an object with data, loading state, error, and more.

**Basic Example:**

```tsx
import { useQuery } from "@tanstack/react-query";
import { hotelApi } from "@/api/hotel/hotel.api";

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: hotelResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => hotelApi.getHotel(id as string),
    enabled: !!id, // Only run query if id exists
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return <div>{hotelResponse?.data.name}</div>;
};
```

**Key Properties:**

- `queryKey`: Unique identifier for the query (used for caching)
- `queryFn`: Function that returns a promise
- `enabled`: Conditionally enable/disable the query
- `staleTime`: How long data is considered fresh
- `gcTime`: How long unused data stays in cache

### Query States

React Query provides several state flags:

```tsx
const {
  data,           // The data returned from queryFn
  isLoading,      // True when fetching for the first time
  isFetching,     // True when fetching (including refetch)
  isError,        // True if query failed
  error,          // Error object if query failed
  isSuccess,      // True if query succeeded
  isPending,      // True when query is in pending state
  refetch,        // Function to manually refetch
} = useQuery({ ... });
```

**Real Example: Multiple Queries**

**File: `pages/user/HotelDetailPage.tsx`**

```tsx
const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // Query 1: Get hotel details
  const {
    data: hotelResponse,
    isLoading: isLoadingHotel,
    error: hotelError,
  } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => hotelApi.getHotel(id as string),
    enabled: !!id,
  });

  // Query 2: Get amenities
  const { data: amenitiesResponse, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });

  // Query 3: Get available rooms (depends on search params)
  const { data: roomsResponse, isLoading: isLoadingRooms } = useQuery({
    queryKey: [
      "availableRooms",
      id,
      checkIn,
      checkOut,
      capacity,
      minPrice,
      maxPrice,
    ],
    queryFn: () =>
      hotelApi.getAvailableRoomsByHotel(id as string, {
        checkIn: checkIn || "",
        checkOut: checkOut || "",
        capacity: capacity ? parseInt(capacity) : 1,
      }),
    enabled: !!id && !!checkIn && !!checkOut && !!capacity,
  });

  // Query 4: Get reviews
  const { data: reviewsResponse, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewApi.getHotelReviews(id as string),
    enabled: !!id,
  });

  // Combined loading state
  if (
    isLoadingHotel ||
    isLoadingAmenities ||
    isLoadingRooms ||
    isLoadingReviews
  ) {
    return <Skeleton />;
  }

  return <div>Hotel content...</div>;
};
```

### Conditional Queries with `enabled`

Use `enabled` to conditionally run queries:

```tsx
// Only fetch when user is authenticated
const { data } = useQuery({
  queryKey: ["user"],
  queryFn: () => authApi.getMe(),
  enabled: isAuthenticated,
});

// Only fetch when all required params exist
const { data } = useQuery({
  queryKey: ["rooms", hotelId, checkIn, checkOut],
  queryFn: () => hotelApi.getRooms(hotelId, { checkIn, checkOut }),
  enabled: !!hotelId && !!checkIn && !!checkOut,
});
```

---

## 4. Mutations

### useMutation Hook

`useMutation` is used for creating, updating, or deleting data. Unlike queries, mutations are not automatically executed.

**Basic Example:**

```tsx
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth.api";

const LoginPage = () => {
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const result = await authApi.login(data.email, data.password);
      return result;
    },
    onSuccess: async (response) => {
      if (response.success) {
        toast.success("Login successful");
        navigate("/");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const handleSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

**Mutation States:**

```tsx
const mutation = useMutation({ ... });

mutation.mutate(data);        // Execute mutation
mutation.isPending;           // True while mutation is running
mutation.isError;             // True if mutation failed
mutation.isSuccess;           // True if mutation succeeded
mutation.data;                // Response data
mutation.error;               // Error object
mutation.reset();             // Reset mutation state
```

**Real Example: Login Mutation**

**File: `pages/auth/LoginPage.tsx`**

```tsx
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const result = await authApi.login(data.email, data.password);
      return result;
    },
    onSuccess: async (response) => {
      if (response.success) {
        try {
          const userResponse = await authApi.getMe();
          if (userResponse.success) {
            dispatch(setUser(userResponse.data));
            toast.success("Login successful");

            // Navigate based on user role
            const role = userResponse.data.role;
            switch (role) {
              case "admin":
                navigate("/admin/partners");
                break;
              case "partner":
                navigate("/partner/hotels/info");
                break;
              default:
                navigate("/");
            }
          }
        } catch (error) {
          toast.error("Failed to get user info");
        }
      } else {
        toast.error(response.message || "Login failed");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage || "Login error occurred");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

### Mutation with Query Invalidation

After a mutation, you often need to refetch related queries:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ReviewForm = ({ hotelId }: { hotelId: string }) => {
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: (data: ReviewData) => reviewApi.createReview(data),
    onSuccess: () => {
      toast.success("Review created!");

      // Invalidate related queries to refetch
      queryClient.invalidateQueries({ queryKey: ["reviews", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
    },
  });

  const handleSubmit = (data: ReviewData) => {
    createReviewMutation.mutate({ ...data, hotelId });
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

---

## 5. Query Keys & Cache Management

### Query Keys

Query keys uniquely identify queries in the cache. They should be arrays that include all variables that affect the query.

**Best Practices:**

```tsx
// ✅ Good: Include all dependencies
queryKey: ["hotels", locationName, checkIn, checkOut, capacity, page];

// ✅ Good: Hierarchical structure
queryKey: ["hotel", id];
queryKey: ["hotel", id, "reviews"];
queryKey: ["hotel", id, "rooms"];

// ❌ Bad: Missing dependencies
queryKey: ["hotels"]; // Missing filters!
```

**Real Example: Complex Query Key**

**File: `pages/user/SearchResultPage.tsx`**

```tsx
const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const locationName = searchParams.get("locationName") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const capacity = Number(searchParams.get("capacity")) || 1;
  const currentPage = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort") || "price";

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "hotels",
      locationName,
      checkIn,
      checkOut,
      capacity,
      currentPage,
      sortBy,
      minPrice,
      maxPrice,
      roomType,
      roomAmenities,
      hotelAmenities,
      minRating,
      maxRating,
    ],
    queryFn: async () => {
      return await hotelApi.searchHotelsWithAvailableRooms({
        locationName,
        checkIn,
        checkOut,
        capacity,
        page: currentPage,
        sort: sortBy,
        // ... other params
      });
    },
  });

  return <div>Search results...</div>;
};
```

### Cache Invalidation

Invalidate queries to force refetch:

```tsx
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ["hotel", id] });

// Invalidate all queries starting with "hotel"
queryClient.invalidateQueries({ queryKey: ["hotel"] });

// Invalidate and refetch immediately
queryClient.invalidateQueries({
  queryKey: ["hotel", id],
  refetchType: "active", // Only refetch active queries
});
```

**Real Example: Invalidate After Mutation**

**File: `components/user/hotel-detail/HotelReviews.tsx`**

```tsx
const ReviewFormModal = ({ hotelId, onSuccess }: Props) => {
  const queryClient = useQueryClient();

  const updateReviewMutation = useMutation({
    mutationFn: (params: UpdateReviewParams) =>
      reviewApi.updateReview(params.id, params.data),
    onSuccess: () => {
      toast.success("Review updated!");

      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ["reviews", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["availableRooms"] });

      onSuccess();
    },
  });

  return <div>Review form...</div>;
};
```

### Manual Cache Updates

Update cache directly without refetching:

```tsx
// Update cache directly
queryClient.setQueryData(["hotel", id], (oldData) => ({
  ...oldData,
  name: "New Hotel Name",
}));

// Remove from cache
queryClient.removeQueries({ queryKey: ["hotel", id] });

// Clear all cache
queryClient.clear();
```

**Real Example: Clear Cache on Logout**

**File: `features/auth/authSlice.ts`**

```tsx
import { queryClient } from "@/lib/react-query";

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear all cached queries on logout
      queryClient.clear();
    },
  },
});
```

---

## 6. Advanced Patterns

### Dependent Queries

Run a query only after another query succeeds:

```tsx
const { data: hotel } = useQuery({
  queryKey: ["hotel", id],
  queryFn: () => hotelApi.getHotel(id),
});

const { data: rooms } = useQuery({
  queryKey: ["rooms", hotel?.id],
  queryFn: () => hotelApi.getRooms(hotel.id),
  enabled: !!hotel?.id, // Only run when hotel data exists
});
```

### Parallel Queries

Run multiple independent queries simultaneously:

```tsx
const hotelQuery = useQuery({
  queryKey: ["hotel", id],
  queryFn: () => hotelApi.getHotel(id),
});

const amenitiesQuery = useQuery({
  queryKey: ["amenities"],
  queryFn: () => amenitiesApi.getAmenities(),
});

const reviewsQuery = useQuery({
  queryKey: ["reviews", id],
  queryFn: () => reviewApi.getHotelReviews(id),
});

// All queries run in parallel
```

### Query Retry Configuration

Customize retry behavior:

```tsx
const { data } = useQuery({
  queryKey: ["hotel", id],
  queryFn: () => hotelApi.getHotel(id),
  retry: 3, // Retry 3 times on failure
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

### Stale Time & Cache Time

Control how long data stays fresh and cached:

```tsx
const { data } = useQuery({
  queryKey: ["amenities"],
  queryFn: () => amenitiesApi.getAmenities(),
  staleTime: 10 * 60 * 1000, // Data fresh for 10 minutes
  gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes
});
```

### Refetch Options

Control when queries refetch:

```tsx
const { data } = useQuery({
  queryKey: ["hotel", id],
  queryFn: () => hotelApi.getHotel(id),
  refetchOnWindowFocus: false, // Don't refetch on focus
  refetchOnReconnect: true, // Refetch when online
  refetchInterval: 30000, // Refetch every 30 seconds
});
```

---

## 7. Common Patterns in This Project

### Pattern 1: Search with Multiple Filters

```tsx
const SearchResultPage = () => {
  const [searchParams] = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: [
      "hotels",
      locationName,
      checkIn,
      checkOut,
      capacity,
      page,
      sortBy,
      // ... all filter params
    ],
    queryFn: () =>
      hotelApi.searchHotels({
        /* params */
      }),
  });
};
```

### Pattern 2: Mutation with Multiple Invalidations

```tsx
const mutation = useMutation({
  mutationFn: updateData,
  onSuccess: () => {
    // Invalidate all related queries
    queryClient.invalidateQueries({ queryKey: ["hotel", id] });
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
    queryClient.invalidateQueries({ queryKey: ["reviews", id] });
  },
});
```

### Pattern 3: Conditional Query Execution

```tsx
const { data } = useQuery({
  queryKey: ["rooms", hotelId, checkIn, checkOut],
  queryFn: () => hotelApi.getRooms(hotelId, { checkIn, checkOut }),
  enabled: !!hotelId && !!checkIn && !!checkOut, // All required
});
```

### Pattern 4: Loading State Handling

```tsx
const { data: hotel, isLoading: isLoadingHotel } = useQuery({
  queryKey: ["hotel", id],
  queryFn: () => getHotel(id),
});

const { data: rooms, isLoading: isLoadingRooms } = useQuery({
  queryKey: ["rooms", id],
  queryFn: () => getRooms(id),
});

// Combined loading state
if (isLoadingHotel || isLoadingRooms) {
  return <Skeleton />;
}
```

---

## Troubleshooting

### Query Not Fetching

**Problem**: Query doesn't execute

**Solutions**:

- ✅ Check if `QueryClientProvider` wraps your app
- ✅ Verify `enabled` option isn't blocking the query
- ✅ Check query key matches exactly
- ✅ Ensure `queryFn` returns a promise

### Stale Data

**Problem**: Data doesn't update after mutation

**Solutions**:

- ✅ Invalidate queries after mutation
- ✅ Use `refetchType: "active"` for immediate refetch
- ✅ Check `staleTime` configuration
- ✅ Manually refetch with `refetch()`

### Infinite Refetch Loop

**Problem**: Query keeps refetching

**Solutions**:

- ✅ Check `refetchOnWindowFocus` setting
- ✅ Verify `refetchInterval` isn't set too low
- ✅ Check query key stability (shouldn't change on every render)
- ✅ Review `staleTime` configuration

### Cache Not Clearing

**Problem**: Old data persists after logout

**Solutions**:

- ✅ Call `queryClient.clear()` on logout
- ✅ Use `queryClient.removeQueries()` for specific queries
- ✅ Check `gcTime` configuration

---

## Summary

React Query simplifies server state management in React applications. Key takeaways:

1. **QueryClientProvider** wraps your app to enable React Query
2. **useQuery** fetches and caches data automatically
3. **useMutation** handles data modifications
4. **Query Keys** uniquely identify cached data
5. **Cache Invalidation** keeps data fresh after mutations
6. **Conditional Queries** with `enabled` option
7. **Loading & Error States** handled automatically

### Common Hooks

#### useQuery

Fetch and cache data.

```tsx
const { data, isLoading, isError, error } = useQuery({
  queryKey: ["key", params],
  queryFn: () => api.getData(params),
  enabled: condition,
});
```

#### useMutation

Modify data.

```tsx
const mutation = useMutation({
  mutationFn: (data) => api.updateData(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["key"] });
  },
});

mutation.mutate(data);
```

#### useQueryClient

Access QueryClient instance.

```tsx
const queryClient = useQueryClient();

queryClient.invalidateQueries({ queryKey: ["key"] });
queryClient.setQueryData(["key"], newData);
queryClient.clear();
```

This project demonstrates a production-ready React Query setup with proper caching, error handling, and cache invalidation strategies.

---

## Additional Resources

- [React Query Official Docs](https://tanstack.com/query/latest)
- [React Query v5 Migration Guide](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples/react/basic)
