import "@/styles/index.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Layout from "@/pages/layout";
import Home from "./pages/home";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import NotFound from "./pages/not-found";
import AuthLayout from "./pages/auth/authLayout";
import Me from "./pages/me/page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Main Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="channels/me" element={<Me />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
