import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Route, Routes } from "react-router";
import Layout from "./layouts/RootLayout";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import SearchResultPage from "./pages/SearchResultPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import BookingInformationPage from "./pages/BookingInformationPage";

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
          <Route path="/blog" element={<BlogPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
