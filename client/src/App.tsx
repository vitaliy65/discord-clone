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
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { initializeSocketEvents } from "@/utils/socket";

import CheckAuth from "./components/auth/checkAuth";
import { store } from "@/_store/store";

import "@/styles/App.css";
import "@/styles/index.css";

import { Provider } from "react-redux";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Check Auth pages*/}
      <Route
        path="channels/me"
        element={
          <CheckAuth>
            <Me />
          </CheckAuth>
        }
      />

      <Route
        path="channels/me/:id"
        element={
          <CheckAuth>
            <Me />
          </CheckAuth>
        }
      />

      {/* Main Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
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
  useEffect(() => {
    // Connect to socket server
    socket.connect();
    initializeSocketEvents(store);

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
