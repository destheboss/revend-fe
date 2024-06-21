import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import UserProfilePage from './pages/UserProfilePage';
import CreateEditListingPage from './pages/CreateEditListingPage';
import ConversationsPage from './pages/ConversationsPage';
import ChatWindowPage from './pages/ChatWindowPage';
import Layout from './components/Layout';
import ListingDetailsPage from './pages/ListingDetailsPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './services/AuthContext';
import CategoryPage from './pages/CategoryPage'
import ControlPanelPage from './pages/ControlPanelPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/ownProfile" element={<UserProfilePage/>} />
            <Route path="/listing/:listingId" element={<ListingDetailsPage />} />
            <Route path="/listing/create" element={<CreateEditListingPage />} />
            <Route path="/listing/edit/:listingId" element={<CreateEditListingPage />} />
            <Route path="/conversations/user/:userId" element={<ConversationsPage />} />
            <Route path="/conversations/:conversationId/messages" element={<ChatWindowPage />} />
            <Route path="/listings/category/:category" element={<CategoryPage />} />
            <Route path="/profile/:userId" element={<ProfilePage/>} />
            <Route path="/control-panel" element={<ControlPanelPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;