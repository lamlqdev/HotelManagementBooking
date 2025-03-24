import { Route, Routes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { queryClient } from "./lib/react-query";

import Layout from "./layouts/UserLayout";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "./components/layout/ThemeProvider";

import HomePage from "./pages/user/HomePage";
import AboutPage from "./pages/user/AboutPage";
import SearchResultPage from "./pages/user/SearchResultPage";
import HotelDetailPage from "./pages/user/HotelDetailPage";
import BookingInformationPage from "./pages/user/BookingInformationPage";
import BookingGuidePage from "./pages/user/BookingGuidePage";
import ContactUs from "./pages/user/ContactUs";
import SettingPage from "./pages/user/SettingPage";
import ProfilePage from "./pages/user/ProfilePage";
import Partnership from "./pages/user/Partnership";
import RegisterPartner from "./pages/user/RegisterPartner";

import BlogPage from "./pages/user/BlogPage";
import BlogDetailPage from "./pages/user/BlogDetailPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

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
            <Route path="/partnership" element={<Partnership />} />
            <Route path="/register-partner" element={<RegisterPartner />} />
          </Route>

          {/* Auth Routes - Chỉ truy cập khi chưa đăng nhập */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Routes User - Yêu cầu đăng nhập */}
          <Route element={<PrivateRoute role="user" />}>
            <Route element={<Layout />}>
              <Route
                path="/booking-information"
                element={<BookingInformationPage />}
              />
              <Route path="/settings" element={<SettingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
