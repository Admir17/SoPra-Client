"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Card, Button, Input, Form } from "antd";
import Link from "next/link";

const Profile: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await apiService.get<User>(`/users/${id}`);
        setUser(userData);
        form.setFieldsValue({
          username: userData.username,
          birthDate: userData.birthDate?.split("T")[0] || "",
        });
      } catch (error) {
        console.error("Error when retrieving the user:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [id]);

  const handleSave = async (values: {
    username: string;
    birthDate: string;
  }) => {
    try {
      await apiService.put(`/users/${id}`, values);
      setIsEditing(false);
      const updatedUser = await apiService.get<User>(`/users/${id}`);
      setUser(updatedUser);
      alert("Profile successfully updated.");
    } catch (error) {
      console.error("Error when updating the profile:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    }
  };

  if (!user) return <div>Loading...</div>;

  const isOwnProfile = user.token === localStorage.getItem("token");

  return (
    <Card title={`Profile: ${user.username}`} className="card-container">
      <p>Online-Status: {user.status}</p>
      <p>
      Date of creation: {user.creationDate?.split("T")[0] || "Not available"}
      </p>

      {isEditing ? (
        <Form form={form} onFinish={handleSave}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please enter a user name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="birthDate" label="Birthdate">
            <Input type="date" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}
          >
            Save
          </Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>

          <br />
          <br />
          {error && <div className="error-container">{error}</div>}
        </Form>
      ) : (
        <>
          <p>
            Birthdate: {user.birthDate?.split("T")[0] || "Not specified"}
          </p>
          {isOwnProfile && (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </>
      )}
      <br />
      <br />
      <br />
      <Link href="/users">
        <Button>Back to User Overview</Button>
      </Link>
    </Card>
  );
};

export default Profile;
