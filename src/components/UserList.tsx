import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

const UserList: React.FC = () => {
    console.log("Rendering UserList"); // Debugging line
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8080/users')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => console.error("There was an error fetching the users: ", error));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.firstName} {user.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
export {};