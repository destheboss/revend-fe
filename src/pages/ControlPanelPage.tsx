import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { userService } from '../services/userService';
import { User } from '../components/AuthTypes';

const ControlPanelPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers({ sortBy, role: filterRole });
      console.log('Fetched users:', response.data.users);  // Log the fetched users
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [sortBy, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleRoleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteUser = async (id: any) => {
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Control Panel</Typography>
      <Select
        value={sortBy}
        onChange={handleSortChange}
        displayEmpty
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="firstName">Sort by First Name</MenuItem>
      </Select>
      <Select
        value={filterRole}
        onChange={handleRoleFilterChange}
        displayEmpty
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>All Roles</em>
        </MenuItem>
        <MenuItem value="USER">User</MenuItem>
        <MenuItem value="ADMIN">Admin</MenuItem>
      </Select>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.roles ? user.roles.join(', ') : 'No Role'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                    Update
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ControlPanelPage;