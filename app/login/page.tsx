"use client";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import Link from "next/link";

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await apiService.post<User>("/users/login", values);

      if (response.token) {
        localStorage.setItem("token", response.token);
        router.push("/users");
      } else {
        alert("Login failed, no token received.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during login.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <Form
        form={form}
        name="login"
        size="large"
        variant="outlined"
        onFinish={handleLogin}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Login
          </Button>
        </Form.Item>
        <p>Do not have an account yet?</p>
      <Link href="/register">
        <Button>Register</Button>
      </Link>
      </Form>
      {error && <div className="error-container">{error}</div>}
    </div>
  );
};

export default Login;
