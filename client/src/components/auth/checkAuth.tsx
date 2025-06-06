import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { fetchUserData } from "@/_store/user/userSlice";
import InitialDataLoader from "@/components/dataLoader/initialDataLoader";
import StatusLoader from "../dataLoader/statusLoader";

export default function CheckAuth() {
  // Check if the user is authenticated by checking the token in local storage
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const res = await dispatch(fetchUserData());

        if (res.type === "user/fetchUserData/rejected") {
          navigator("/login", { replace: true });
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigator("/login", { replace: true }); // Redirect on error
      }
    };

    checkAuth();
  }, [user.id]);

  if (isLoading) {
    return (
      <div className="items-position-center w-screen h-screen">
        <div className="main-loading-spinner"></div>
      </div>
    );
  }

  return (
    <InitialDataLoader>
      <StatusLoader>
        <Outlet />
      </StatusLoader>
    </InitialDataLoader>
  );
}
