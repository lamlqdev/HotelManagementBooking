import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow max-w-screen">
        <div className="absolute top-6 left-0 right-0 z-50">
          <Header />
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
