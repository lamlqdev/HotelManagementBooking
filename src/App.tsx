import { Route, Routes } from "react-router";
import { Toaster } from "sonner";

import Layout from "./layouts/UserLayout";
import PartnerLayout from "./layouts/PartnerLayout";
import AdminLayout from "./layouts/AdminLayout";
import PublicRoute from "./components/routes/PublicRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import { ThemeProvider } from "./components/setting/ThemeProvider";

// Public Pages
import HomePage from "./pages/user/HomePage";
import AboutPage from "./pages/user/AboutPage";
import SearchResultPage from "./pages/user/SearchResultPage";
import HotelDetailPage from "./pages/user/HotelDetailPage";
import BookingInformationPage from "./pages/user/BookingInformationPage";
import BookingGuidePage from "./pages/user/BookingGuidePage";
import ContactUs from "./pages/user/ContactUs";
import BlogPage from "./pages/user/BlogPage";
import BlogDetailPage from "./pages/user/BlogDetailPage";
import Partnership from "./pages/user/Partnership";
import RegisterPartner from "./pages/user/RegisterPartner";
import RegisterSuccessfullyPage from "./pages/user/RegisterSuccessfullyPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// User Pages
import SettingPage from "./pages/shared/SettingPage";
import UserProfilePage from "./pages/user/ProfilePage";
import FavouriteHotelPage from "./pages/shared/FavouriteHotelPage";

// Partner Pages
import RevenuePage from "./pages/partner/RevenuePage";
import HotelInfoPage from "./pages/partner/HotelInfoPage";
import RoomManagementPage from "./pages/partner/RoomManagementPage";
import RoomStatusPage from "./pages/partner/RoomStatusPage";
import RoomDetailPage from "./pages/partner/RoomDetailPage";
import BookingOrdersPage from "./pages/partner/BookingOrdersPage";
import BookingRequestsPage from "./pages/partner/BookingRequestsPage";
import MessagesPage from "./pages/partner/MessagesPage";
import AccountPage from "./pages/partner/AccountPage";
import PartnerProfilePage from "./pages/partner/ProfilePage";
import NotificationsPage from "./pages/partner/NotificationsPage";

// Admin Pages
import PartnerApproval from "./pages/admin/PartnerApproval";
import PartnerRegistrationDetails from "@/pages/admin/PartnerRegistrationDetails";
import HotelsPage from "./pages/admin/HotelsManagementPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import UserDetailPage from "./pages/admin/UserDetailPage";
import HotelDetailAdminPage from "./pages/admin/HotelDetailPage";
function App() {
  return (
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
          <Route
            path="/booking-information/:roomId"
            element={<BookingInformationPage />}
          />
          <Route
            path="/partner/registration-success"
            element={<RegisterSuccessfullyPage />}
          />
        </Route>

        {/* Auth Routes - Chỉ truy cập khi chưa đăng nhập */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected Routes User - Yêu cầu đăng nhập với role user */}
        <Route element={<PrivateRoute role="user" />}>
          <Route element={<Layout />}>
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Route>

        {/* Shared Page - Có thể truy cập bởi cả user và partner */}
        <Route element={<PrivateRoute role="user" allowMultipleRoles={true} />}>
          <Route element={<Layout />}>
            <Route path="/favourite-hotels" element={<FavouriteHotelPage />} />
          </Route>
        </Route>

        {/* Protected Routes Partner - Yêu cầu đăng nhập với role partner */}
        <Route element={<PrivateRoute role="partner" />}>
          <Route path="/partner" element={<PartnerLayout />}>
            <Route path="revenue" element={<RevenuePage />} />
            <Route path="hotels/info" element={<HotelInfoPage />} />
            <Route path="hotels/rooms" element={<RoomManagementPage />} />
            <Route path="hotels/rooms/:id" element={<RoomDetailPage />} />
            <Route path="hotels/status" element={<RoomStatusPage />} />
            <Route path="bookings/orders" element={<BookingOrdersPage />} />
            <Route path="bookings/requests" element={<BookingRequestsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="profile" element={<PartnerProfilePage />} />
            <Route path="settings" element={<SettingPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Protected Routes Admin - Yêu cầu đăng nhập với role admin */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="partners" element={<PartnerApproval />} />
            <Route
              path="partners/:id"
              element={<PartnerRegistrationDetails />}
            />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="hotels/:id" element={<HotelDetailAdminPage />} />
            <Route path="settings" element={<SettingPage />} />
          </Route>
        </Route>
      </Routes>

      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;
