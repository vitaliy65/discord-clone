import React, { useState } from "react";
import Input from "@/components/auth/custom.input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "@/utils/constants";

export interface RegisterUserData {
  user_unique_id: string;
  username: string;
  email: string;
  password: string;
}

export default function Register() {
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
        // Handle successful registration (e.g., redirect to login)
        navigator("/login", { replace: true });
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Register</h1>
      <form
        className="flex flex-col items-center gap-4 mt-4 w-full"
        onSubmit={handleSubmit}
      >
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
        <button className="bg-blue-500 w-full text-white p-2 mt-8 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
