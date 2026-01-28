import React from 'react';

export const SemanticSearchPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[960px] px-6 py-10">
        {/* Headline Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-sm">colors_spark</span>
            AI-POWERED SEARCH
          </div>
          <h1 className="text-[40px] font-bold leading-tight tracking-tight mb-2">How can we help you today?</h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-lg">Search through community wisdom using natural language.</p>
        </div>

        {/* Search Bar Area */}
        <div className="relative group mb-2 focus-within:shadow-[0_0_15px_rgba(19,127,236,0.3)] transition-shadow duration-300 rounded-xl">
          <label className="flex flex-col w-full h-16">
            <div className="flex w-full flex-1 items-stretch rounded-xl overflow-hidden bg-white dark:bg-[#233648] shadow-xl border border-slate-200 dark:border-transparent">
              <div className="text-primary flex items-center justify-center pl-5">
                <span className="material-symbols-outlined text-[28px]">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 px-4 text-lg font-normal placeholder:text-slate-400 dark:placeholder:text-[#92adc9]" placeholder="Ask anything... e.g., 'Where can I find the best study spots with coffee?'" defaultValue="" />
              <div className="flex items-center pr-3">
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2">
                  <span>Search</span>
                </button>
              </div>
            </div>
          </label>
        </div>
        <p className="text-[#92adc9] text-xs font-normal leading-normal text-center pt-2">✨ Understanding context, intent, and community sentiment</p>

        {/* Trending Tags Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold leading-tight tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">trending_up</span>
              AI-Generated Trending Tags
            </h3>
            <button className="text-primary text-sm font-semibold hover:underline">Refresh</button>
          </div>
          <div className="flex flex-wrap gap-2 px-1">
            <button className="px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium hover:bg-primary hover:text-white transition-all">#LateNightStudy</button>
            <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-[#92adc9] text-sm font-medium hover:bg-primary/10 transition-all">#HackathonPrep</button>
            <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-[#92adc9] text-sm font-medium hover:bg-primary/10 transition-all">#QuietZones</button>
            <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-[#92adc9] text-sm font-medium hover:bg-primary/10 transition-all">#EspressoDeals</button>
            <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-[#92adc9] text-sm font-medium hover:bg-primary/10 transition-all">#GroupProjects</button>
            <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-[#92adc9] text-sm font-medium hover:bg-primary/10 transition-all">#CommuterTips</button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#233648] pb-4">
            <h3 className="text-lg font-bold leading-tight tracking-tight">Semantic Results</h3>
            <div className="flex gap-4">
              <select className="bg-transparent border-none text-sm text-slate-500 dark:text-[#92adc9] focus:ring-0">
                <option>Sort by: Relevance</option>
                <option>Sort by: Newest</option>
              </select>
            </div>
          </div>

          {/* Result Card 1 */}
          <div className="bg-white dark:bg-[#1a2632] rounded-xl p-5 border border-slate-200 dark:border-[#233648] hover:border-primary/50 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-200" data-alt="Student avatar with coffee" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFMR5hvxuyE3VPodLn7dps40imLKVCruL01h7Bq1zfU4yDQmpfOoPKkYP3g3wA_pL2RNr9nJ6pIt5lSiF1DccY87vCH6Ty3RyT8Mzoh0g0dBrTgOw47pkphBMLw8SiB42IOJqJuCQdnvFOnA0qIoYDbUYKTanmZuM9ptVBj34tiEgVAyu-Rw0rZ0zxNXvgVSRHQYuCP6vAt2QtO2Fgz5TLGNs9VmCCiQOKF5QfHnSiQve95mZP0bzpMxDh3nNexURoTgMslBtMsQ')", backgroundSize: "cover" }}></div>
                <div>
                  <p className="font-semibold text-sm">Elena Rodriguez</p>
                  <p className="text-xs text-slate-500 dark:text-[#92adc9]">2 hours ago in <span className="text-primary">#CampusLife</span></p>
                </div>
              </div>
              <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/20">
                98% Semantic Match
              </div>
            </div>
            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Best hidden gems for study marathons</h4>
            <p className="text-slate-600 dark:text-[#92adc9] text-sm leading-relaxed mb-4">
              If you're looking for caffeine and quiet, the Library Cafe's basement level is a savior. They have those deep booths and the Wi-Fi is consistently the fastest on campus...
            </p>
            <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary mb-4">
              <div className="flex items-center gap-2 text-primary text-xs font-bold mb-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs">summarize</span>
                AI Summary
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">"Recommends the Library Cafe basement for high-speed Wi-Fi and comfortable seating. Ideal for long study sessions."</p>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button className="flex items-center gap-1 text-xs hover:text-primary"><span className="material-symbols-outlined text-sm">thumb_up</span> 124</button>
              <button className="flex items-center gap-1 text-xs hover:text-primary"><span className="material-symbols-outlined text-sm">chat_bubble</span> 18</button>
              <button className="flex items-center gap-1 text-xs hover:text-primary"><span className="material-symbols-outlined text-sm">share</span> Share</button>
            </div>
          </div>

          {/* Result Card 2 */}
          <div className="bg-white dark:bg-[#1a2632] rounded-xl p-5 border border-slate-200 dark:border-[#233648] hover:border-primary/50 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-200" data-alt="Male student profile picture" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9wvPNabeymNWhleZNpw5Pf7UJalnBwYHlq2tUKfU_dRfY0yd0nY10tijp2TidEmsGdeC00cnbKR09nMChruQo6DgO3vhX4UtzIxZUnvz1EbdlcALDfWz-TGP_3C-rsH2HMqdiP2Nb1v8bh0g7xEGIKlSGCSGvkuavJoG6kaPzWfI7PxvkKbKcbOdC0sxK6pUVNBxfqLHUMYrcA7xj_bfnb_wugqmBVzYOb78K8DkKJ96iwPGmTzJ7uk_zAIRSek961xIQE8UFJg')", backgroundSize: "cover" }}></div>
                <div>
                  <p className="font-semibold text-sm">Marcus Chen</p>
                  <p className="text-xs text-slate-500 dark:text-[#92adc9]">5 hours ago in <span className="text-primary">#Engineering</span></p>
                </div>
              </div>
              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20">
                85% Semantic Match
              </div>
            </div>
            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Alternative coffee spots when the Union is packed</h4>
            <p className="text-slate-600 dark:text-[#92adc9] text-sm leading-relaxed mb-4">
              Don't forget the Science Building lounge. It's usually empty after 4 PM and the vending machine actually has decent cold brew. Not a 'cafe' but definitely a spot...
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <button className="flex items-center gap-1 text-xs hover:text-primary"><span className="material-symbols-outlined text-sm">thumb_up</span> 56</button>
              <button className="flex items-center gap-1 text-xs hover:text-primary"><span className="material-symbols-outlined text-sm">chat_bubble</span> 4</button>
              <button className="flex items-center gap-1 text-xs hover:text-primary"><span className="material-symbols-outlined text-sm">share</span> Share</button>
            </div>
          </div>

          {/* Result Card 3 (Image Focused) */}
          <div className="bg-white dark:bg-[#1a2632] rounded-xl p-5 border border-slate-200 dark:border-[#233648] hover:border-primary/50 transition-all group shadow-sm">
            <div className="flex gap-5">
              <div className="w-1/3 h-32 rounded-lg bg-cover bg-center overflow-hidden" data-alt="Modern cozy cafe interior with wood accents" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDviSWAgfmBlINWB3dJXm1lJPvhRx0tgPT2tLfREov4pwRi5tX_h8_48o5uWWrWg9LTOX_zx5ILGePR0XxBmh-4GQx6zTB0paA9bQS_sVTaatFX9xoSPqYI6YhIFjyaamR3FLNGY2ZpG04FI3g_i8j4w66yX0amz-LPEIs5OjFfNRBLW5Vg3AyS7VCa9OgB17QX_647hiOyn4Nqg1350FZDUY7Bb_NdiO1SClYMP2sJH39XIGTxBBjtw9ThAzIsn6eZm-2KL-K4Qg')" }}></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-slate-500 dark:text-[#92adc9]">Posted in <span className="text-primary">#Foodies</span> • Yesterday</p>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20">
                    72% Semantic Match
                  </div>
                </div>
                <h4 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">New Cafe Opening: The Daily Grind</h4>
                <p className="text-slate-600 dark:text-[#92adc9] text-sm leading-relaxed mb-3">
                  Just opened across the North Gate. Tons of outlets and they do a student discount if you show your ID...
                </p>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1 bg-slate-100 dark:bg-[#233648] rounded text-[10px] font-bold uppercase tracking-tight">Outlets Available</button>
                  <button className="px-3 py-1 bg-slate-100 dark:bg-[#233648] rounded text-[10px] font-bold uppercase tracking-tight">Student Discount</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Load More / Footer */}
        <div className="mt-12 text-center pb-20">
          <button className="px-8 py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
            Load More Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default SemanticSearchPage;
