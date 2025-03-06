"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Card, Table } from "antd";
import type { TableProps } from "antd";

const columns: TableProps<User>["columns"] = [
  { title: "Username", dataIndex: "username", key: "username" },
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Birthday", dataIndex: "birthDate", key: "birthDate" },
  { title: "Creation Date", dataIndex: "creationDate", key: "creationDate" },
  { title: "Id", dataIndex: "id", key: "id" },
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const users: User[] = await apiService.get<User[]>("/users");
        setUsers(users);
      } catch (error) {
        console.error("Error when retrieving users:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUsers();
  }, []);

    const handleLogout = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        
        // look for all existing users
        const allUsers: User[] = await apiService.get<User[]>("/users");
  
        // get user id by token of logged in user from local storage
        const currentUser = allUsers.find((user) => user.token === token);
  
        if (!currentUser) {
          throw new Error("Current user not found");
        }
  
        // logout user from server and update status property
        await apiService.post(`/users/${currentUser.id}/logout`, {});
  
        // delete token and navigate back to login page
        localStorage.removeItem("token");
        router.push("/login");
    } catch (error) {
          console.error("Error during logout:", error);
          alert(
            "There was an error logging out. You will be redirected to the login!"
          );
          router.push("/login");
        }
      };

  return (
    <div className="card-container">
      <Card
        title="Get all users from secure endpoint:"
        loading={!users}
        className="dashboard-container"
      >
        {users && (
          <>
            <Table<User>
              columns={columns}
              dataSource={users}
              rowKey="id"
              onRow={(row) => ({
                onClick: () => router.push(`/users/${row.id}`),
                style: { cursor: "pointer" },
              })}
            />
            <Button onClick={handleLogout} type="primary">
              Logout
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
