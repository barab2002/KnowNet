import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostDetailsPage from '../features/post-details/PostDetailsPage';
import SemanticSearchPage from '../features/semantic-search/SemanticSearchPage';
import FeedPage from '../features/feed/FeedPage';
import StudentDashboardPage from '../features/student-dashboard/StudentDashboardPage';
import UserProfilePage from '../features/user-profile/UserProfilePage';
import SettingsPage from '../features/settings/SettingsPage';
import { Layout } from '../components/Layout';

export function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={<FeedPage />} />
              <Route path="/post-details" element={<PostDetailsPage />} />
              <Route path="/semantic-search" element={<SemanticSearchPage />} />
              <Route path="/student-dashboard" element={<StudentDashboardPage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
