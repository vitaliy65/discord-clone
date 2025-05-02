import React, { useState } from "react";
import Input from "@/components/auth/custom.input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "@/utils/constants";
import FadeInFadeOut from "@/components/animatedComponents/fadeInFadeOut";

import "@/styles/pages/auth/register.css";

export interface RegisterUserData {
  user_unique_id: string;
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [isVisible, setIsVisible] = useState(true);
  const [userData, setUserData] = useState<RegisterUserData>({
    user_unique_id: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<RegisterUserData>({
    user_unique_id: "",
    username: "",
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
      .post(`http://${SERVER_URL}/api/users/register`, userData)
      .then(() => {
        setIsVisible(false);
      })
      .catch((error) => {
        setIsVisible(true);
        setError(error.response.data);
      });
  };

  return (
    <FadeInFadeOut
      isVisible={isVisible}
      onExitComplete={() => {
        navigator("/login", { replace: true });
      }}
    >
      <div className="register-container">
        <h1 className="register-title">Register</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="user_unique_id"
            lable={error.user_unique_id}
            value={userData.user_unique_id}
            onChange={handleInputChange}
            placeholder="user unique id"
          />
          <Input
            type="text"
            name="username"
            lable={error.username}
            value={userData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />
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

          <button className="submit-button">Register</button>

          <div className="flex justify-center gap-2 text-center">
            <p>Already have an account?</p>
            <a
              className="already-have-account-link"
              onClick={() => setIsVisible(false)}
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </FadeInFadeOut>
  );
}
