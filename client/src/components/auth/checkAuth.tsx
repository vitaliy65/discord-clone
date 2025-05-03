import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { fetchUserData } from "@/_store/user/userSlice";

export default function CheckAuth({ children }: { children: ReactNode }) {
  // Check if the user is authenticated by checking the token in local storage
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token") || "";
        const res = await dispatch(fetchUserData(token));

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
      <div className="items-position-center">
        <div className="main-loading-spinner"></div>
      </div>
    );
  }

  return children;
}
