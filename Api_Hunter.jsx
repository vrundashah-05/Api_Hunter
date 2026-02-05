import React, { useState, useEffect } from "react";
import "./Api_Hunter.css";

function Api_Hunter() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editUser, setEditUser] = useState(null); // for modal

  // READ - Fetch all users
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // CREATE - Add new user
  const addUser = () => {
    if (!newUser.name || !newUser.email) return alert("Fill all fields");

    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then(res => res.json())
      .then(data => setUsers([...users, data]));

    setNewUser({ name: "", email: "" });
  };

  // PATCH - Update user
  const updateUser = () => {
    if (!editUser.name || !editUser.email) return alert("Fill all fields");

    fetch(`http://localhost:5000/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editUser.name, email: editUser.email }),
    })
      .then(res => res.json())
      .then(data => {
        setUsers(users.map(u => (u.id === data.id ? data : u)));
        setEditUser(null); // close modal
      });
  };

  // DELETE - Delete user
  const deleteUser = (id) => {
    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then(() => setUsers(users.filter(u => u.id !== id)));
  };

  return (
    <div className="user-container">
      <h1>Api Hunter</h1>

      {/* Add New User */}
      <div className="form">
        <input
          type="text"
          placeholder="Full Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button className="add-btn" onClick={addUser}>Add User</button>
      </div>

      {/* Users List */}
      <div className="user-list">
        {users.map(u => (
          <div className="user-card" key={u.id}>
            <h3>{u.name}</h3>
            <p>{u.email}</p>
            <div className="buttons">
              <button className="update-btn" onClick={() => setEditUser(u)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteUser(u.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User</h2>
            <input
              type="text"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <input
              type="email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
            <div className="modal-buttons">
              <button className="save-btn" onClick={updateUser}>Save</button>
              <button className="cancel-btn" onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Api_Hunter;