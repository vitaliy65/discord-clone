import React, { useState } from "react";
import Input from "@/components/auth/custom.input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SERVER_API_URL } from "@/utils/constants";
import FadeInFadeOut from "@/components/animatedComponents/fadeInFadeOut";

export interface LoginUserData {
  email: string;
  password: string;
}

export default function Login() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toMainPage, setToMainPage] = useState(false);
  const [userData, setUserData] = useState<LoginUserData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<LoginUserData>({
    email: "",
    password: "",
  });

  const navigator = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${SERVER_API_URL}/users/login`, userData)
      .then((response) => {
        const { token } = response.data;
        setIsVisible(false);
        setToMainPage(true);
        localStorage.setItem("token", token);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsVisible(true);
        setError(error.response.data);
      });
  };

  return (
    <FadeInFadeOut
      isVisible={isVisible}
      onExitComplete={() => {
        if (toMainPage) {
          navigator("/channels/me", { replace: true });
        } else {
          navigator("/register", { replace: true });
        }
      }}
    >
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            lable={error.email}
            value={userData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <Input
            type="password"
            name="password"
            lable={error.password}
            value={userData.password}
            onChange={handleInputChange}
            placeholder="password"
          />

          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <button className="submit-button">Login</button>
          )}

          <div className="flex justify-center gap-2 text-center">
            <p>Don't have an account?</p>
            <a
              className="dont-have-account-link"
              onClick={() => setIsVisible(false)}
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </FadeInFadeOut>
  );
}
