import { Outlet } from "react-router-dom";
import "@/styles/pages/auth/bg.css";

export default function AuthLayout() {
  return (
    <div className="auth-form-bg">
      <Outlet />
    </div>
  );
}
