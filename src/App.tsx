import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Route, Routes } from "react-router";
import Layout from "./layouts/RootLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "sonner";

import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import SearchResultPage from "./pages/SearchResultPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import BookingInformationPage from "./pages/BookingInformationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactUs from "./pages/ContactUs";
import BookingGuidePage from "./pages/BookingGuidePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* Public Routes - Có thể truy cập khi chưa đăng nhập */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/hoteldetail/:id" element={<HotelDetailPage />} />
            <Route path="/booking-guide" element={<BookingGuidePage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
          </Route>

          {/* Auth Routes - Chỉ truy cập khi chưa đăng nhập */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Routes - Yêu cầu đăng nhập */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/booking-information"
                element={<BookingInformationPage />}
              />
              {/* Thêm các route cần bảo vệ khác ở đây */}
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
