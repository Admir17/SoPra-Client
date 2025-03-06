"use client";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import Link from "next/link";

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  const handleRegister = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await apiService.post<User>("/users", values);

      if (response.token) {
        localStorage.setItem("token", response.token);
        router.push("/users");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during registration.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Register</h1>
      <Form
        form={form}
        name="register"
        size="large"
        variant="outlined"
        onFinish={handleRegister}
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
            Register
          </Button>
        </Form.Item>
        <p>Already have an account?</p>
      <Link href="/login">
        <Button>Login</Button>
      </Link>
      </Form>
      {error && <div className="error-container">{error}</div>}
    </div>
  );
};

export default Register;
