import React from 'react';

export const UserProfilePage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      <div className="flex h-full min-h-screen w-full">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col bg-background-light dark:bg-background-dark sticky top-0 h-screen p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight">KnowNet</h1>
              <p className="text-slate-500 dark:text-[#92adc9] text-xs">AI Student Hub</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#92adc9] hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors" href="#">
              <span className="material-symbols-outlined">home</span>
              <span className="text-sm font-medium">Home</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#92adc9] hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors" href="#">
              <span className="material-symbols-outlined">groups</span>
              <span className="text-sm font-medium">Communities</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#92adc9] hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors" href="#">
              <span className="material-symbols-outlined">search</span>
              <span className="text-sm font-medium">Search</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#92adc9] hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors" href="#">
              <span className="material-symbols-outlined">notifications</span>
              <span className="text-sm font-medium">Notifications</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <span className="text-sm font-medium">Profile</span>
            </a>
          </nav>
          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQSUqvXAGj8lkgIsfjeYaBoAZrzM8UT6RFYJn2M_yB1BQ4dlzXPKYxh1h09-DgfDmmDpWltxmy4YY3-qWv1uy3frqrQt5_10IebTnUUbfmgV4esD-ZW9SLks_n_nWH37uxNeUoUhdxcWRUOCY7LdIu9hWDTC5HX1TG3iXY5Fqz0l0ouvrkJQy2vfhr_rT5GK-pCFg0sWZykQXa-TAZa-zEmFMLFMtkZ1Mi-w4PaTywaG0gURyMx-R5foDAFx6hSywvVlvM-2meKg")' }}></div>
              <div className="flex flex-col">
                <span className="text-xs font-bold truncate">Alex Johnson</span>
                <span className="text-[10px] text-slate-500">CS Senior</span>
              </div>
              <span className="material-symbols-outlined text-sm ml-auto cursor-pointer">settings</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex justify-center py-8 px-4 overflow-y-auto">
          <div className="max-w-[800px] w-full flex flex-col gap-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-[#192633] rounded-xl p-6 border border-slate-200 dark:border-[#324d67]">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group cursor-pointer">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-white dark:border-[#111a22] shadow-xl" data-alt="Detailed close-up of male student avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQPXmIOuVihMlkDxHc6ggkIwxa8pHz6wUHk8NzM4y3qz2wVP_CNZTIlzowu9sdjBfXkM1ubIyAhGV0EaBsO3z5qHvfxnAIM0p0Mu-mXVMHUoVs0GfrXdi0RKYWT-z2CIosIU8i4MUqONJnFRsTKncgVedx4scCoJQqJ4OS0mYVL-AA1GAt_dkoMGVhpFXn4NoEm27SN2KIBb7RAgj4WvJ4MxeFOjBBkjYG6nZcBjWXXFUUEDaaaVdZ3PvJ0y_zVcOohFdTy5QM2Q")' }}>
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">photo_camera</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h2 className="text-2xl font-bold leading-tight">Alex Johnson</h2>
                    <button className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90">
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Edit Profile</span>
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-[#92adc9] text-base font-normal">Computer Science | Class of 2025</p>
                  <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-[#92adc9] text-sm">
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    <span>Joined September 2022</span>
                  </div>
                </div>
              </div>
              {/* Profile Stats */}
              <div className="flex flex-wrap gap-4 mt-8 border-t border-slate-100 dark:border-[#324d67] pt-6">
                <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#324d67] p-4">
                  <p className="text-2xl font-bold leading-tight">42</p>
                  <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-wider">Posts</p>
                </div>
                <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#324d67] p-4">
                  <p className="text-2xl font-bold leading-tight">1.2k</p>
                  <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-wider">Likes</p>
                </div>
                <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#324d67] p-4">
                  <p className="text-2xl font-bold leading-tight">15</p>
                  <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-wider">AI Summaries</p>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200 dark:border-[#324d67] flex gap-8">
              <a className="flex items-center gap-2 border-b-2 border-primary text-primary pb-3 pt-2" href="#">
                <span className="material-symbols-outlined text-[20px]">article</span>
                <p className="text-sm font-bold tracking-tight">My Posts</p>
              </a>
              <a className="flex items-center gap-2 border-b-2 border-transparent text-slate-500 dark:text-[#92adc9] pb-3 pt-2 hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
                <p className="text-sm font-bold tracking-tight">Liked Posts</p>
              </a>
            </div>

            {/* Feed Area */}
            <div className="flex flex-col gap-4">
              {/* Post Card 1 */}
              <div className="bg-white dark:bg-[#192633] border border-slate-200 dark:border-[#324d67] rounded-xl overflow-hidden flex flex-col md:flex-row group">
                <div className="w-full md:w-64 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover" data-alt="Abstract quantum computing visualization with neon circuits" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuARW5YPxx5QyX1DjYBIc53y5esh9fpByhTMwtwZRGw7rFKNOUeGiwsZOZRRroGJOpv-Xjyppwm0mTc53ZlkblFcX9WTbNfr4nghp10Xs9pkbPxPTH3JbwK6aEFhSA_PABR5_nIHUIpRzaVrakppqqqDIs67q_HmQtR6fAutH3PzPs_qG9a-PTbklkEdwKaqlV4uHxxdmvyP70q18sdji1nkVNXj2UTiKW6gr-4P06QYINMmF-sbpoavVe7FJCzl-mSkdIhdxW9mEA")' }}>
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">Quantum Computing</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">Study Guide</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-white hover:text-primary">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-white hover:text-red-500">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">Understanding Quantum Computing Algorithms</h3>
                  <div className="bg-slate-50 dark:bg-[#233648]/50 border-l-2 border-primary p-3 rounded-r-lg mb-4">
                    <p className="text-slate-600 dark:text-[#92adc9] text-xs leading-relaxed italic">
                      <span className="font-bold flex items-center gap-1 mb-1 not-italic text-primary"><span className="material-symbols-outlined text-xs">auto_awesome</span> AI Summary:</span>
                      A comprehensive breakdown of Shor's and Grover's algorithms. Includes complexity analysis and circuit diagrams for final exam preparation.
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">favorite</span> 120</span>
                      <span className="flex items-center gap-1"><span class="material-symbols-outlined text-sm">comment</span> 15</span>
                      <span>Dec 12, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Post Card 2 */}
              <div className="bg-white dark:bg-[#192633] border border-slate-200 dark:border-[#324d67] rounded-xl overflow-hidden flex flex-col md:flex-row group">
                <div className="w-full md:w-64 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover" data-alt="Top down view of a desk with laptop, coffee and notebooks" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClam48YxLMw7Dw_87vMWz0JuixS2WL7vLB61hyJWxKInq7C04kJxv5YE8ktF3nR6QroCxWoH3EOcXDzqO-tx1_9zjHltKdRoSapDBL3hPNBgl2JRHvOMItncJ9yRRq1FcREAkzn0aMLO7paAJWhtJIUm3dmcspL_YtxfO2tBIMgKO3F6YbFxI_W5w0a3ZJwqFi0Q1kWDMuaygOhmmOAGd59A8UtivKNQ2v-6Yv2Ef62Ice46021aS4us2J1TnlO_X5pXDYF4y2ug")' }}>
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">Productivity</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-white hover:text-primary">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-white hover:text-red-500">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">How I managed to learn 3 frameworks in one semester</h3>
                  <div className="bg-slate-50 dark:bg-[#233648]/50 border-l-2 border-primary p-3 rounded-r-lg mb-4">
                    <p className="text-slate-600 dark:text-[#92adc9] text-xs leading-relaxed italic">
                      <span className="font-bold flex items-center gap-1 mb-1 not-italic text-primary"><span className="material-symbols-outlined text-xs">auto_awesome</span> AI Summary:</span>
                      Personal roadmap for rapid learning using active recall, Spaced Repetition, and project-based learning.
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">favorite</span> 84</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">comment</span> 3</span>
                      <span>Nov 28, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Create New Post Prompt */}
              <div className="mt-4 p-8 border-2 border-dashed border-slate-200 dark:border-[#324d67] rounded-xl flex flex-col items-center justify-center gap-4 text-center">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <div>
                  <p className="font-bold">Share something new</p>
                  <p className="text-sm text-slate-500 dark:text-[#92adc9]">Your thoughts could help fellow students.</p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Create Post</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
