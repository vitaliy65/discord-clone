import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-form-bg">
      <Outlet />
    </div>
  );
}
