import React from 'react';

export const FeedPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
        {/* Main Content Feed */}
        <div className="col-span-9 md:col-span-6 space-y-6">
          {/* Create Post Trigger */}
          <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img alt="Profile" className="w-full h-full object-cover" data-alt="User profile avatar smiling young man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_4nrruZU9T_Pv6aK5TQQkd6xu7pEDZYSguwuvgD44WmsF1nBVE5Y1BfbeI287Lp8WIb04g379pjrWaevtFhoLTzKM4-7rT_Y_YtuKZY9FWm8HaWkEmf3uHTrAgFkyRE2ycyTSY69scwpDHmfhH1Wl9F9NtoBdEknQDmSr7bHUjz0umMjxRarNCsWQFEycdabga1gABPA2K14wGzkfBowJXzCkHJkRU6HFzcmoYx9whP755nkbEaXmUizVsXySydPKFAtRtkJWpA" />
              </div>
              <button className="flex-1 bg-slate-100 dark:bg-background-dark/50 text-slate-500 text-left px-5 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-background-dark transition-colors">
                Share something smart with your peers...
              </button>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-icons-round text-blue-500 text-sm">image</span>
                  Media
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-icons-round text-green-500 text-sm">poll</span>
                  Poll
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-icons-round text-amber-500 text-sm">event</span>
                  Event
                </button>
              </div>
              <button className="bg-primary text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                Post
              </button>
            </div>
          </div>

          {/* Post Card 1 */}
          <article className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/50 transition-colors">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" data-alt="Portrait of a female student with glasses" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5L0-J1vz7WJfgmoZBE6gBg_qYjCp2P9gZsYdg20Fd4p_npMm6VP_uA1naN9MMqqITaV6bjnFR4waSDrBLfF2Pq6xbqZBgH0JkWczI-EJYc8vwTUmwCZuRlgYq9UrqoTpKxafU2dczjGdyrq4KmVhGu4vHUyOZPMlfbMQiNvnBVu9JF1745FGuseneIH2FLBLzHx3-fI_yqApKCD8JQ15DXQ2l4pc0eWYxE9hYMGZpl3LpzzkxkCHUwMFGSIJCQzyZYodrVi2vzA" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">Sarah Chen</h4>
                    <p className="text-xs text-slate-500">Computer Science • 2 hours ago</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary"><span className="material-icons-round">more_horiz</span></button>
              </div>
              {/* AI Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20">
                  <span className="material-icons-round text-[12px]">auto_awesome</span> STUDY GROUP
                </span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-background-dark text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Physics 101</span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-background-dark text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Main Library</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed mb-4">
                Anyone struggling with the Quantum Mechanics problem set due Friday? I've booked a study room in the main library for tomorrow afternoon. We'll be going through the double-slit experiment equations and the wave function derivations. All levels welcome!
              </p>
              <div className="rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
                <img alt="Library" className="w-full h-64 object-cover" data-alt="Modern university library interior with large windows and bookshelves" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlTQZ1D8_7JahBJyCRN7kZU8ukL9nkqUXp34c68HICONx1imKB8PjzN_DHVMA6rIHnFadpwm8SuhyYgpPdHrUyskYy1yZcUozKgBkJvR9d5VYwtXx8t57phh4gK-oNbtLyxwtbu1V6wAW5UXBHMYo31gaeNuxaodw88Mcqpawe6-1Kbm0WESlAvGNHdjB1deUtrKGifFsUk5dC8ppUqbYncH0LiZa--OJBNL5_YI5kjYuK7fuFCMDypUByVRSYwdQUj1h04sUSdQ" />
              </div>
              {/* AI Summary Block */}
              <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-round text-primary text-sm">bolt</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Summary</span>
                </div>
                <p className="text-xs italic text-slate-600 dark:text-slate-400">
                  Sarah is organizing a Physics study session at the Main Library tomorrow to tackle the Quantum Mechanics problem set before Friday's deadline.
                </p>
              </div>
              {/* Action Footer */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
                  <span className="material-icons-round text-lg">favorite_border</span>
                  <span className="text-sm font-medium">24</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                  <span className="material-icons-round text-lg">chat_bubble_outline</span>
                  <span className="text-sm font-medium">12</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                  <span className="material-icons-round text-lg">ios_share</span>
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </article>

          {/* Post Card 2 */}
          <article className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/50 transition-colors">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" data-alt="Portrait of a male student with a smile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3YVX8apezs_vQfuCiAZHR6ufo3iQ3oM57VNVX_xWF85hf-DxUeXH0YH_U30Rn8TMdm6jjWllB-w-2PUrA-x-xi_auJxaXlh5gH3m3tWZ6gV8gfsnEoB4bF9qiX9fbgsCV9e2geHxSwJKm1im5Wp12U0s3IAdcURgjZZBHEuqZBwDLjph-EooScMhv72WZTFQ3frqb8NkPdd37W35BEMY5uiucCCxNMIxeIjJoeuCvWbpRuRzlRwdI2zi3QtQ232p076f0KF3Qlg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">Marcus Rodriguez</h4>
                    <p className="text-xs text-slate-500">Business Admin • 5 hours ago</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary"><span className="material-icons-round">more_horiz</span></button>
              </div>
              {/* AI Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20">
                  <span className="material-icons-round text-[12px]">auto_awesome</span> CAMPUS NEWS
                </span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-background-dark text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Expansion</span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-background-dark text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Student Union</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed mb-4">
                New blueprints for the Student Union expansion were just released! Looks like we're finally getting a 24-hour food court and more dedicated quiet zones. What do you all think of the modern glass design?
              </p>
              {/* AI Summary Block */}
              <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-round text-primary text-sm">bolt</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Summary</span>
                </div>
                <p className="text-xs italic text-slate-600 dark:text-slate-400">
                  Marcus shares updates on the Student Union's new expansion plans, featuring a 24-hour food court and quiet zones.
                </p>
              </div>
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button className="flex items-center gap-1.5 text-red-500 transition-colors">
                  <span className="material-icons-round text-lg">favorite</span>
                  <span className="text-sm font-medium">156</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                  <span className="material-icons-round text-lg">chat_bubble_outline</span>
                  <span className="text-sm font-medium">42</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                  <span className="material-icons-round text-lg">ios_share</span>
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </article>

          {/* Infinite Scroll Loader */}
          <div className="py-8 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
            <p className="text-xs font-medium text-slate-400">AI is curating more for you...</p>
          </div>
        </div>

        {/* Right Side Panel */}
        <aside className="col-span-9 md:col-span-3 hidden lg:block space-y-6">
          {/* AI Insights Panel */}
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary">psychology</span>
              <h3 className="font-bold text-sm tracking-tight">Personalized Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-background-dark rounded-lg">
                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-tighter">Your Week</p>
                <p className="text-sm">You've engaged with 4 posts about <span className="text-primary font-medium">Machine Learning</span> today.</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-background-dark rounded-lg">
                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-tighter">Campus Vibe</p>
                <p className="text-sm text-amber-600 dark:text-amber-400">High activity around "Library Renovations" topic.</p>
              </div>
            </div>
          </div>
          {/* Smart Recommendations */}
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-bold text-sm mb-4">Who to follow</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" data-alt="Portrait of a female researcher" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3-9qxdy8URqD5_UeDQ5jo3gp68CNJHNBXRhoMqlIAUfx9Pyj8jIScJlFzX3eEMhgD2XAQ2XYR6zWmW-PyiXRqFezvpCZLtEd2Ng8R9nd-C5dlrsIGoBhDC9PJU3pUwku21YKWMoh50wZzRcK-hZ91lYLiFl4AIyZzclMiQLCIV9To0pZEV3ZboDRIANrs-ZZykesCyf6c-yIJAE-Kjv37MCrys_VZYCzwYluK9HUL8g6dilldCHpJL43bPa8wOE7ww7oHgQoNHA" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">Prof. Miller</p>
                    <p className="text-[10px] text-slate-500">Biology Dept.</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-primary hover:underline">FOLLOW</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" data-alt="Portrait of a male graduate student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCug2HEWJzv_oJqIzDMGVH9hTVb1O5AEsYe8yo-WKKDU8j1KL22UKZT7362bCU222IxFyBo8c3SlTfNCb-z8v1T5fSp01atpzZZovn1_52JRP2Dg8qFyCyE6jWGSDXuwPzJBuBdRBrqLZjDqOXTrrFzPQnUO3pqLxwpG4_aGJZIArmPrnl77_lKlT9eIFZp6zQ3QxxlnQvdTD-a5xOSxFS5jPCwI6BNBbsiOALICY5BZaXlIWgXlZJWhv3OH8720pBPsZy0oDDDHQ" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">Alex Rivera</p>
                    <p className="text-[10px] text-slate-500">Grad Student</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-primary hover:underline">FOLLOW</button>
              </div>
            </div>
          </div>
          {/* Copyright/Links */}
          <div className="px-5 text-[10px] text-slate-400 space-y-1">
            <div className="flex flex-wrap gap-x-2">
              <a className="hover:underline" href="#">Privacy Policy</a>
              <a className="hover:underline" href="#">Terms of Service</a>
              <a className="hover:underline" href="#">Campus Guidelines</a>
            </div>
            <p>© 2024 KnowNet AI Platform</p>
          </div>
        </aside>
    </div>
  );
};

export default FeedPage;
