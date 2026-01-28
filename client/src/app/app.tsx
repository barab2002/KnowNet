import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeNavigation />} />
          {/* Feature routes will be added here via merges */}
        </Routes>
    </BrowserRouter>
  );
}

function HomeNavigation() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">CampusLens UI Development</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
         <div className="p-6 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-lg mb-2">Development Links</h2>
            <p className="text-slate-500 text-sm mb-4">Select a screen to view:</p>
            <nav className="flex flex-col gap-2">
                <Link to="/post-details" className="text-primary hover:underline">Post Details</Link>
                <Link to="/semantic-search" className="text-primary hover:underline">Semantic Search</Link>
                <Link to="/feed" className="text-primary hover:underline">Home Feed</Link>
                <Link to="/student-dashboard" className="text-primary hover:underline">Student Dashboard</Link>
                <Link to="/user-profile" className="text-primary hover:underline">User Profile</Link>
            </nav>
         </div>
      </div>
    </div>
  )
}

export default App;
