// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx

"use client";

import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="card-container">
      <p>
        <strong>SampleUser</strong>
      </p>
    </div>
  );
};

export default Profile;
