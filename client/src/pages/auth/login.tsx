import React, { useState } from "react";
import Input from "@/components/auth/custom.input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "@/utils/constants";

import "@/styles/pages/auth/login.css";

export interface LoginUserData {
  email: string;
  password: string;
}

export default function Login() {
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
    axios
      .post(`http://${SERVER_URL}/api/users/login`, userData)
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        navigator("/channels/me", { replace: true });
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  return (
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

        <button className="submit-button">Login</button>

        <div className="flex justify-center gap-2 text-center">
          <p>Don't have an account?</p>
          <a href="/register" className="dont-have-account-link">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
