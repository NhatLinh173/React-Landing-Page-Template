import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Tải dữ liệu từ cơ sở dữ liệu khi component được tạo
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  return (
    <div className="container-admin">
      <h2>Quản Lý Người Dùng</h2>
      {/* Hiển thị danh sách người dùng */}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
