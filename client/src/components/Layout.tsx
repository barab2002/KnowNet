import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const Layout = () => {
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
          <div className="flex-1 max-w-2xl relative group hidden sm:block">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input className="w-full bg-slate-100 dark:bg-card-dark border-none rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-primary text-sm transition-all outline-none" placeholder="Semantic search: 'physics study groups' or 'best coffee near library'..." type="text" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
              <span className="material-icons-round">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
              <img alt="Profile" className="w-full h-full object-cover" data-alt="User profile avatar smiling young man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvtexDhPhar8YHNlSTSnW4u-Cr6-wLTamZ6XqrJcCGbnv8HsimarRRtRyBOXOivrORYRp5w4dPCWMc7KGnm8X9k3kPAXU9d6G4gN-ayhLHw5yHnG5Mh4wYJRpprIH9Rm8Q56nNjDmxPmfrhn5OkejcNpGBpQHyRZNnCYuEozb0BKzo27GFFl5ZPMAKFtOY3Kybd8KWCrsbCGJYc977RMJ4LdWMuB3NpS4jMZy4Vl058nKZE5lgpsUsafPMMG57ba5uOyNwIkIKMg" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6 w-full flex-1">
        {/* Sidebar Navigation */}
        <aside className="col-span-3 hidden lg:block sticky top-24 h-fit space-y-2">
          <nav className="space-y-1">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`}>
              <span className="material-icons-round">home</span>
              Home Feed
            </NavLink>
             <NavLink to="/semantic-search" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`}>
              <span className="material-icons-round">explore</span>
              Semantic Search
            </NavLink>
            <NavLink to="/student-dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`}>
              <span className="material-icons-round">dashboard</span>
              Dashboard
            </NavLink>
            <NavLink to="/user-profile" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`}>
              <span className="material-icons-round">person</span>
              Profile
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'}`}>
              <span className="material-icons-round">settings</span>
              Settings
            </NavLink>
          </nav>
          <div className="pt-6">
            <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trending Tags</h3>
            <div className="flex flex-wrap gap-2 px-2">
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-card-dark rounded-lg text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">#FinalsWeek</span>
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-card-dark rounded-lg text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">#Hackathon2024</span>
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-card-dark rounded-lg text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">#CampusSafety</span>
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-card-dark rounded-lg text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">#CS50</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area - This is where pages will be injected */}
        <div className="col-span-12 lg:col-span-9 w-full">
            <Outlet />
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card-dark border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
        <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary' : 'text-slate-400'}><span className="material-icons-round">home</span></NavLink>
        <NavLink to="/semantic-search" className={({ isActive }) => isActive ? 'text-primary' : 'text-slate-400'}><span className="material-icons-round">explore</span></NavLink>
        <button className="bg-primary text-white p-2 rounded-full shadow-lg -mt-8 border-4 border-background-light dark:border-background-dark"><span className="material-icons-round">add</span></button>
        <NavLink to="/student-dashboard" className={({ isActive }) => isActive ? 'text-primary' : 'text-slate-400'}><span className="material-icons-round">dashboard</span></NavLink>
        <NavLink to="/user-profile" className={({ isActive }) => isActive ? 'text-primary' : 'text-slate-400'}><span className="material-icons-round">person</span></NavLink>
      </nav>
    </div>
  );
};
