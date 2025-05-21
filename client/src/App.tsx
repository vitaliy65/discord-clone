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
import Me from "./pages/me/me";

import CheckAuth from "./components/auth/checkAuth";
import { store } from "@/_store/store";

import "@/styles/App.css";
import "@/styles/index.css";

import { Provider } from "react-redux";
import Chat from "./components/userMainPage/chat";
import AddFriend from "./components/userMainPage/sections/section.friends/addFriend";
import FriendRequets from "./components/userMainPage/sections/section.friendRequests/friendRequets";
import ChannelChat from "./components/channels.layout/channelChat";
import ChannelsLayout from "./pages/channel/channelsLayout";
import Discoverylayout from "./pages/channel/discovery/layout";
import ChannelSearch from "./pages/channel/discovery/channelSearch";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Check Auth pages*/}
      {/* Групуємо всі захищені сторінки під CheckAuth */}
      <Route element={<CheckAuth />}>
        <Route path="channels/me" element={<Me />}>
          <Route path="" element={<Chat />} />
          <Route path=":id" element={<Chat />} />
          <Route path="addFriend" element={<AddFriend />} />
          <Route path="friendRequests" element={<FriendRequets />} />
        </Route>

        {/* channel layout */}
        <Route path="channels" element={<ChannelsLayout />}>
          <Route path=":id" element={<ChannelChat />} />
          <Route path=":id/:id" element={<ChannelChat />} />
        </Route>

        {/* search channels layout */}
        <Route path="discovery" element={<Discoverylayout />}>
          <Route path="servers" element={<ChannelSearch />} />
        </Route>
      </Route>

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
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
