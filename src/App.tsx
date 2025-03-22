import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Route, Routes } from "react-router";
import Layout from "./layouts/RootLayout";

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

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/hoteldetail/:id" element={<HotelDetailPage />} />
          <Route
            path="/booking-information"
            element={<BookingInformationPage />}
          />
          <Route path="/booking-guide" element={<BookingGuidePage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
