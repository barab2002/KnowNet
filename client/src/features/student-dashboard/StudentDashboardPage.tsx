import React from 'react';

export const StudentDashboardPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
      `}</style>
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* TopNavBar Navigation */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#283039] px-4 md:px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-50">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-primary">
                <div className="size-6">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">KnowNet</h2>
              </div>
              <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-[#283039] items-center justify-center pl-4 rounded-l-lg" data-icon="search">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-[#283039] focus:border-none h-full placeholder:text-slate-400 px-4 pl-2 text-base font-normal leading-normal" placeholder="Search community..." defaultValue="" />
                </div>
              </label>
            </div>
            <div className="flex flex-1 justify-end gap-4 md:gap-8">
              <div className="hidden lg:flex items-center gap-9">
                <a className="text-slate-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Home</a>
                <a className="text-slate-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Community</a>
                <a className="text-slate-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">AI Insights</a>
                <a className="text-slate-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Events</a>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-[#283039] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#3b4754] transition-all">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-[#283039] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#3b4754] transition-all">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary" data-alt="User profile avatar of Alex Rivera" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBk7vhQLZw3TxNIjL4cG722IPo0nmnvPysmV6gVFh8GYV_cBVKrspH2DBe0HyvjfSUVeQPSrmB_s6wfW7u-EJxd1VUSXZHE9RwAnJURFAEY-1T_EBTB2qV_fsBzpbViq5JRBpzpAClBfcWadBa6ihF-8Qw_-ojEmn4XQ7RrjRHZNSGZMXDCnEG1hSlubKsyRrSpo8ZT63-aqE9Rr5k6fHlCwbSVyTALXpktFZoQ9Vy9OstumirVEEfZVVCgs6lNPPyx6ORM3qolXw")' }}></div>
            </div>
          </header>

          <main className="flex-1 flex justify-center py-8">
            <div className="layout-content-container flex flex-col max-w-[960px] w-full px-4 md:px-0">
              {/* ProfileHeader */}
              <div className="flex p-4 md:p-6 bg-white dark:bg-[#1c2127] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex w-full flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="relative group">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20" data-alt="Large profile picture of Alex Rivera" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCsWsvVxGh1A9EZG1KcjZ6dq1MsebVYxiH7nNJ_FHxSWkPD2RIStyqIkKd3kajExWnQpv4Nez9uwzW65XP88YobR3UiPmnkTTncIAHMJGDBSrvX6XitFO48Oi7z__M3f5rcBpVXo4IzvYf1EKPV_hyeF8GG1TjHYvNOnHlmSrPsveZQKgiUE8HokzmwNHS9e6HSrYgHu8fiRsZ7ziGwRCnwYAa_lyjd54ilQAD4yWUyfnbqN6I_HuZz6RkRosLfheslnI8zM0esg")' }}></div>
                    <button className="absolute bottom-1 right-1 bg-primary p-2 rounded-full text-white border-2 border-white dark:border-[#1c2127] shadow-lg hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </button>
                  </div>
                  <div className="flex flex-col flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <h1 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">Alex Rivera</h1>
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-base font-normal leading-normal">Computer Science Senior | Class of 2024</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                      <span className="text-primary text-sm font-semibold">@arivera_dev</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Top Contributor</span>
                    </div>
                    <p className="mt-3 text-slate-600 dark:text-[#9dabb9] text-sm max-w-md">Passionate about AI ethics and fine-tuning large language models for educational accessibility. Coding the future, one prompt at a time.</p>
                    <div className="flex w-full mt-6 gap-3 justify-center md:justify-start">
                      <button className="flex min-w-[120px] items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-[#283039] text-slate-700 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-[#3b4754] transition-all">
                        <span>Change Photo</span>
                      </button>
                      <button className="flex min-w-[120px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all">
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* ProfileStats */}
              <div className="flex flex-wrap gap-4 py-6">
                <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-transparent p-4 items-center md:items-start shadow-sm">
                  <p className="text-slate-900 dark:text-white tracking-light text-2xl font-bold leading-tight">124</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-sm">article</span>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-normal leading-normal uppercase tracking-wider font-semibold">Posts</p>
                  </div>
                </div>
                <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-transparent p-4 items-center md:items-start shadow-sm">
                  <p className="text-slate-900 dark:text-white tracking-light text-2xl font-bold leading-tight">1.2k</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-sm">favorite</span>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-normal leading-normal uppercase tracking-wider font-semibold">Likes</p>
                  </div>
                </div>
                <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-transparent p-4 items-center md:items-start shadow-sm">
                  <p className="text-slate-900 dark:text-white tracking-light text-2xl font-bold leading-tight">450</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-sm">chat_bubble</span>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-normal leading-normal uppercase tracking-wider font-semibold">Comments</p>
                  </div>
                </div>
                <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl border border-primary/30 bg-primary/5 p-4 items-center md:items-start shadow-sm">
                  <p className="text-primary tracking-light text-2xl font-bold leading-tight">88</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">neurology</span>
                    <p className="text-primary/70 text-sm font-normal leading-normal uppercase tracking-wider font-semibold">AI Score</p>
                  </div>
                </div>
              </div>
              {/* Tabs Section */}
              <div className="mb-6">
                <div className="flex border-b border-slate-200 dark:border-[#3b4754] gap-10">
                  <a className="flex flex-col items-center justify-center border-b-[3px] border-primary text-primary pb-[13px] pt-4" href="#">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">dynamic_feed</span>
                      <p className="text-sm font-bold leading-normal tracking-[0.015em]">My Feed</p>
                    </div>
                  </a>
                  <a className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 dark:text-[#9dabb9] pb-[13px] pt-4 hover:text-primary transition-colors" href="#">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">bookmark</span>
                      <p className="text-sm font-bold leading-normal tracking-[0.015em]">Saved</p>
                    </div>
                  </a>
                </div>
              </div>
              {/* Main Body Feed */}
              <div className="flex flex-col gap-6">
                {/* Post Card 1 */}
                <div className="flex flex-col md:flex-row items-stretch justify-start rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1c2127] border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                  <div className="w-full md:w-1/3 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover" data-alt="Modern office research space with laptops" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLpeu7aXj-4nBqkD_hoNyJv_dj1pavn3h6nI30iw5k3fFx10rG7mlwISk6lQveoGZaIqB9C5WI4O6XePoDFDCDX_s7S7vWWjQ4SGGvY3DEgooJKonKDo5l5ZnGxGKiOKtsyPV9ERkH-IFPRWktZf4FwCJwCglOkkYhRJhtXqDLr-DgWUQTLkJodhy6GSvqqG4RaWVAzOLovkX-ARpa6Z6yhY8W9aCQXI3RzU1BNaaWH_9Tx_oKfW_hdi7mJWp1O5GbzQRh88dCKw")' }}></div>
                  <div className="flex flex-1 flex-col items-stretch justify-between p-5 md:p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">Research</span>
                        <p className="text-slate-400 dark:text-[#9dabb9] text-xs font-normal">Posted 2 hours ago • Campus Tech Group</p>
                      </div>
                      <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-2">Exploring LLMs in Student Research</h3>
                      <p className="text-slate-600 dark:text-[#9dabb9] text-base font-normal leading-normal mb-4">Just finished my latest project on fine-tuning LLMs for campus navigation. Check out how we solved the latency issue for real-time queries!</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">favorite</span><span className="text-xs">42</span></div>
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">chat_bubble</span><span className="text-xs">12</span></div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium transition-hover hover:bg-primary/90">
                          <span className="material-symbols-outlined text-[18px] mr-1">edit</span>
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-slate-100 dark:bg-[#283039] text-slate-600 dark:text-white text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all">
                          <span className="material-symbols-outlined text-[18px] mr-1">delete</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Post Card 2 */}
                <div className="flex flex-col md:flex-row items-stretch justify-start rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1c2127] border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                  <div className="w-full md:w-1/3 bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover" data-alt="Student club gathering at university" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJmizEChBPb7zyT59wIbnFe5QpGXGBHTBKFFXtXZe9Xs--0CsickBJzF2WZmgd5DH0JsP_Knd0y6jzTxnDu4HRtzH27fmLwBP1Nz7F9DFbOHMasEAxZeEAGNuoMbha5OFMAxiML4J7RxF5jdYELGlcwq6e--hbk0Uckwd2phCiU4xYH5jo0Bbog_pR54y6UGiiB5ksdc6WoLtmoTQ37ox0H1x_P9iNjGAn6zeRZ6z6tZ4dIFlz2fQ7h72optZLW0L2oTCr9vIQ8w")' }}></div>
                  <div className="flex flex-1 flex-col items-stretch justify-between p-5 md:p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">Community</span>
                        <p className="text-slate-400 dark:text-[#9dabb9] text-xs font-normal">Posted 1 day ago • Student Union</p>
                      </div>
                      <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-2">New Hackathon Season Announced!</h3>
                      <p className="text-slate-600 dark:text-[#9dabb9] text-base font-normal leading-normal mb-4">Get your teams ready for the Winter 2024 Hackathon. We're looking for developers, designers, and problem solvers.</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">favorite</span><span className="text-xs">156</span></div>
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">chat_bubble</span><span className="text-xs">34</span></div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium transition-hover hover:bg-primary/90">
                          <span className="material-symbols-outlined text-[18px] mr-1">edit</span>
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-slate-100 dark:bg-[#283039] text-slate-600 dark:text-white text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all">
                          <span className="material-symbols-outlined text-[18px] mr-1">delete</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* View More Button */}
                <div className="flex justify-center py-4">
                  <button className="px-6 py-2 rounded-full border border-slate-200 dark:border-[#3b4754] text-slate-600 dark:text-[#9dabb9] text-sm font-bold hover:bg-slate-50 dark:hover:bg-[#1c2127] transition-all">
                    Load More Activities
                  </button>
                </div>
              </div>
            </div>
          </main>
          {/* Footer for balance */}
          <footer className="mt-auto py-8 text-center text-slate-400 dark:text-[#4f5b66] text-xs">
            <p>© 2024 KnowNet AI Community Platform. Built for Students.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
