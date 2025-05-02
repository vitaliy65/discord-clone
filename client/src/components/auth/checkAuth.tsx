import { ReactNode, useEffect, useState } from "react";
import { SERVER_API_URL } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckAuth({ children }: { children: ReactNode }) {
  // Check if the user is authenticated by checking the token in local storage
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigator("/login", { replace: true });
          return;
        }

        const response = await axios.get(`${SERVER_API_URL}/users/current`, {
          headers: {
            Authorization: token, // Use token directly
          },
        });

        localStorage.setItem("user", JSON.stringify(response.data));
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigator("/login", { replace: true }); // Redirect on error
      }
    };

    checkAuth();
  }, [navigator]);

  if (isLoading) {
    return (
      <div className="items-position-center">
        <div className="main-loading-spinner"></div>
      </div>
    );
  }

  return children;
}
