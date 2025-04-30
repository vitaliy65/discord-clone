import { Outlet } from "react-router-dom";
import Header from "../components/nav/header";
import Footer from "../components/nav/footer";

export default function Layout() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
