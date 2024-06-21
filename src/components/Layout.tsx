import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Drawer, List, ListItemText, IconButton, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authenticatedDrawerList = (
    <List>
      <ListItemButton component={Link} to="/ownProfile">
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton component={Link} to={`/conversations/user/${user?.id}`}>
        <ListItemText primary="Messages" />
      </ListItemButton>
      <ListItemButton component={Link} to="/listing/create">
        <ListItemText primary="Create Listing" />
      </ListItemButton>
    </List>
  );

  // Log user roles to verify
  console.log('User roles:', user?.roles);

  const isAdmin = user?.roles.some(role => role.toLowerCase() === 'admin');

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu" 
              sx={{ mr: 2 }} 
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ReVend
          </Typography>
          <Button color="inherit" component={Link} to="/">Main Page</Button>
          {isAdmin && (
            <Button color="inherit" component={Link} to="/control-panel">Control Panel</Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {user && (
        <Drawer 
          anchor="left" 
          open={drawerOpen} 
          onClose={() => toggleDrawer(false)}
        >
          {authenticatedDrawerList}
        </Drawer>
      )}
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;