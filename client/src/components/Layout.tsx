import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const defaultAvatar =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCvtexDhPhar8YHNlSTSnW4u-Cr6-wLTamZ6XqrJcCGbnv8HsimarRRtRyBOXOivrORYRp5w4dPCWMc7KGnm8X9k3kPAXU9d6G4gN-ayhLHw5yHnG5Mh4wYJRpprIH9Rm8Q56nNjDmxPmfrhn5OkejcNpGBpQHyRZNnCYuEozb0BKzo27GFFl5ZPMAKFtOY3Kybd8KWCrsbCGJYc977RMJ4LdWMuB3NpS4jMZy4Vl058nKZE5lgpsUsafPMMG57ba5uOyNwIkIKMg';

  const displayName = user?.name || 'Profile';
  const displayImage = user?.profileImageUrl?.trim()
    ? user.profileImageUrl
    : defaultAvatar;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <span className="material-icons-round">auto_awesome</span>
            </div>
            <span className="text-xl font-bold tracking-tight">KnowNet</span>
          </div>
          <div className="flex items-center gap-4">
            <NavLink
              to="/user-profile"
              className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
              title={displayName}
              aria-label={displayName ? `${displayName} profile` : 'Profile'}
              data-testid="navbar-profile-link"
            >
              <img
                alt={displayName}
                className="w-full h-full object-cover"
                src={displayImage}
                data-testid="navbar-avatar-img"
              />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6 w-full flex-1">
        {/* Sidebar Navigation */}
        <aside className="col-span-3 hidden lg:block sticky top-24 h-fit space-y-2">
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`
              }
            >
              <span className="material-icons-round">home</span>
              Home Feed
            </NavLink>
            <NavLink
              to="/semantic-search"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`
              }
            >
              <span className="material-icons-round">explore</span>
              Search
            </NavLink>
            <NavLink
              to="/user-profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`
              }
            >
              <span className="material-icons-round">person</span>
              Profile
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`
              }
            >
              <span className="material-icons-round">settings</span>
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 w-full"
            >
              <span className="material-icons-round">logout</span>
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content Area - This is where pages will be injected */}
        <div className="col-span-12 lg:col-span-9 w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card-dark border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-primary' : 'text-slate-400'
          }
        >
          <span className="material-icons-round">home</span>
        </NavLink>
        <NavLink
          to="/semantic-search"
          className={({ isActive }) =>
            isActive ? 'text-primary' : 'text-slate-400'
          }
        >
          <span className="material-icons-round">explore</span>
        </NavLink>
        <button className="bg-primary text-white p-2 rounded-full shadow-lg -mt-8 border-4 border-background-light dark:border-background-dark">
          <span className="material-icons-round">add</span>
        </button>
        <NavLink
          to="/user-profile"
          className={({ isActive }) =>
            isActive ? 'text-primary' : 'text-slate-400'
          }
        >
          <span className="material-icons-round">person</span>
        </NavLink>
      </nav>
    </div>
  );
};
