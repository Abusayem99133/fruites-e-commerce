import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "../ui/sonner";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;
