import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Số lần thử lại khi query thất bại
      staleTime: 5 * 60 * 1000, // Data được coi là stale sau 5 phút
      gcTime: 10 * 60 * 1000, // Cache được giữ trong 10 phút
      refetchOnWindowFocus: false, // Không refetch khi focus lại window
      refetchOnReconnect: true, // Refetch khi có kết nối lại
    },
    mutations: {
      retry: 1, // Số lần thử lại khi mutation thất bại
    },
  },
});
