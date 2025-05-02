import { Outlet } from "react-router-dom";
import Header from "../components/nav/header";
import Footer from "../components/nav/footer";

export default function Layout() {
  return (
    <div className="flex-row min-h-screen min-w-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
