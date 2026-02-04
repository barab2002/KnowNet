import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostDetailsPage from '../features/post-details/PostDetailsPage';
import SemanticSearchPage from '../features/semantic-search/SemanticSearchPage';
import FeedPage from '../features/feed/FeedPage';
import StudentDashboardPage from '../features/student-dashboard/StudentDashboardPage';
import UserProfilePage from '../features/user-profile/UserProfilePage';
import SettingsPage from '../features/settings/SettingsPage';
import LoginPage from '../features/auth/LoginPage';
import LoginSuccessPage from '../features/auth/LoginSuccessPage';
import RegisterPage from '../features/auth/RegisterPage';
import { Layout } from '../components/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/success" element={<LoginSuccessPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<FeedPage />} />
            <Route path="/post-details" element={<PostDetailsPage />} />
            <Route path="/semantic-search" element={<SemanticSearchPage />} />
            <Route
              path="/student-dashboard"
              element={<StudentDashboardPage />}
            />
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
