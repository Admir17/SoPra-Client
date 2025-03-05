"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Card, Button } from "antd";

const Profile: React.FC = () => {
  const { id } = useParams();
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [birthDate, setBirthDate] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiService.get<User>(`/users/${id}`);
        setUser(userData);

        if (userData.birthDate) {
          const date = new Date(userData.birthDate);
          const offset = date.getTimezoneOffset();
          const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
          setBirthDate(adjustedDate.toISOString().split("T")[0]);
        }
      } catch (error) {
        console.error("Error when retrieving the user:", error);
      }
    };

    fetchUser();
  }, [id, apiService]);

  const handleBirthDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBirthDate(event.target.value);
  };

  const handleSaveBirthDate = async () => {
    try {
      await apiService.put(`/users/${id}`, {
        birthDate: birthDate,
      });
      alert("Date of birth successfully updated");
    } catch (error) {
      console.error("Error updating the date of birth:", error);
      alert("Error when updating the date of birth");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Card title={`Profile: ${user.username}`} className="card-container">
      <p>Online-Status: {user.status}</p>
      <p>
        Date of creation:{" "}
        {user.creationDate
          ? new Date(user.creationDate).toLocaleDateString()
          : "Not available"}
      </p>
      <div>
        <p style={{ color: "white" }}>Birthdate:</p>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "5px",
            border: "1px solid white",
          }}
        >
          <input
            type="date"
            value={birthDate}
            onChange={handleBirthDateChange}
            style={{
              color: "white",
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              width: "100%",
            }}
          />
        </div>

        <Button
          onClick={handleSaveBirthDate}
          type="primary"
          style={{ marginTop: "10px" }}
        >
          Save
        </Button>
      </div>
    </Card>
  );
};

export default Profile;
