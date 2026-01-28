import React from 'react';

export const PostDetailsPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-solid border-slate-200 dark:border-[#233648] px-4 md:px-20 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-primary">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">KnowNet</h2>
            </div>
            <div className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-[#233648]">
                <div className="text-slate-400 dark:text-[#92adc9] flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 text-sm placeholder:text-slate-400 dark:placeholder:text-[#92adc9]" placeholder="Search discussions..." defaultValue="" />
              </div>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <a className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors" href="#">Feed</a>
            <a className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors" href="#">Communities</a>
            <a className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors" href="#">Resources</a>
            <a className="text-primary text-sm font-bold flex items-center gap-1" href="#">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              AI Insights
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#324d67] transition-all">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="hidden sm:flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#324d67] transition-all">
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden">
              <img alt="User Profile" className="w-full h-full object-cover" data-alt="Student avatar profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHhqq2VPQX4ocfw6S-PM01pR5fowGvMJHk7DXB-f1jWgK-bIoAeIYa4IrrY7nsELX3zurGYXKF8OYHFYVik6tHVx6YRMkqepvyKAxB6v8mrb6fpsms2xrw_FC9F2CN4qVqyK6luR1yuD2AINYFTmZrk7LydDhuQLGFLeaF1bvlFZTEN3-7WwQrp9rvx_5QXfMclFzQcGLoXzmkhLSuM4x9LsEdazSpWwOzoYds0ZKFvbePqB8VyHnRlN72oNCAA3Eg3utYm3_aRQ" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[960px] mx-auto w-full py-6 px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <a className="text-slate-400 dark:text-[#92adc9] hover:text-primary transition-colors" href="#">Home</a>
          <span className="text-slate-300 dark:text-[#233648] material-symbols-outlined text-[16px]">chevron_right</span>
          <a className="text-slate-400 dark:text-[#92adc9] hover:text-primary transition-colors" href="#">Computer Science 101</a>
          <span className="text-slate-300 dark:text-[#233648] material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">Post Details</span>
        </nav>

        {/* Original Post Card (Pinned) */}
        <article className="bg-white dark:bg-[#192633] rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-[#233648] mb-6">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img className="w-10 h-10 rounded-full bg-slate-200" data-alt="Author Alex Rivera avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYQAgaUYmjbUAFhCjqapkJUxcYG2D4qFbegLwspV1DhXR2LXEUXUKxlewuo9fsIgLpTy28mNYDzB6a2ob92eeVIf3EBfaf1web6CZW6FRCdVv6n0EFbEBGZqvmmTAf6iZgHsNJhXAqyYXFg-6KWjkhzXOTteFZNTSDXBH05jI0UpPlHFO6szSIIHLdaReiMeec2IzUxEa7UHEP9ESywPkCaYcEUmCJJBEK5-BwJXTx5y1WFQnSGBujgovK6yF6QhRo4MofnNgivg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-bold text-sm">Alex Rivera</span>
                  <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Student</span>
                </div>
                <p className="text-slate-400 dark:text-[#92adc9] text-xs">Posted 2 hours ago in <span className="text-primary">#NeuralNetworks</span></p>
              </div>
              <button className="ml-auto text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight mb-4">
              Understanding Neural Networks: A Deep Dive into Backpropagation
            </h1>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Hey everyone, I'm struggling to grasp the mathematical intuition behind backpropagation in multi-layer perceptrons. Can someone explain the chain rule application in this context? I've been looking at the partial derivatives of the cost function with respect to the weights, but I keep getting lost at the hidden layer activation updates.
              <br /><br />
              Attached is my current logic diagram. Would love some feedback from anyone who's already taken CS229 or similar!
            </div>
            {/* Attached Media Mockup */}
            <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 dark:border-[#324d67]">
              <div className="h-64 w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center" data-alt="Abstract gradient representation of a logic diagram">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 text-center">
                  <span className="material-symbols-outlined text-white text-5xl mb-2">schema</span>
                  <p className="text-white text-sm font-medium">Mathematical_Model_v1.png</p>
                </div>
              </div>
            </div>
            {/* Chips / Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-[#92adc9] text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">tag</span>
                MachineLearning
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-[#92adc9] text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">tag</span>
                Calculus
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-[#92adc9] text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">tag</span>
                StudyGroup
              </div>
            </div>
            {/* Interaction Bar */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-[#233648]">
              <button className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px] fill-primary">thumb_up</span>
                <span>12 Helpful</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 dark:text-[#92adc9] font-medium text-sm">
                <span className="material-symbols-outlined text-[20px]">forum</span>
                <span>4 Comments</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 dark:text-[#92adc9] font-medium text-sm">
                <span className="material-symbols-outlined text-[20px]">share</span>
                <span>Share</span>
              </button>
            </div>
          </div>
        </article>

        {/* AI Action Panel */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center">
            <div className="flex gap-4">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">Lens AI Summary</p>
                <p className="text-slate-500 dark:text-[#92adc9] text-sm font-normal leading-normal">
                  The discussion focuses on the mathematical derivation of gradients in backpropagation. Users are clarifying the role of activation function derivatives in the chain rule.
                </p>
              </div>
            </div>
            <button className="flex shrink-0 min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all">
              View Full Summary
            </button>
          </div>
        </div>

        {/* Comments Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">Discussion (4)</h3>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Sort by:</span>
            <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 p-0 pr-6">
              <option>Top Comments</option>
              <option>Newest First</option>
              <option>Academic Only</option>
            </select>
          </div>
        </div>

        {/* Scrollable Comment List */}
        <div className="space-y-6 mb-24">
          {/* Comment 1 */}
          <div className="flex gap-4 group">
            <div className="shrink-0">
              <img className="w-10 h-10 rounded-full bg-slate-200" data-alt="Student Jordan profile photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfJX4YKOiZqSpVOmRgnyvNllkoMlzn12l-kdMZK-7uAZFrw9OU2ySEEnMCUkAoJ1dSdpyi1Yj01gnvxR9RFr3IZ4Oy6EFZ1ynt25HqBoJcwGf8lwIHjfAUmtgeiSUz_tIQUSRIgdd3pSI6YtuZCNcgmxXvUc3oPh9UK7TeEKaX_XoTREcwD6LBIy0MWqZEyvJMOlbxngRuLMbD6xbSlMz-XVKlkl1YeRQMfbU665D30CT7ij8HlBbvKPbRb_BUYk0ZJgv31518AA" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="bg-white dark:bg-[#192633] border border-slate-100 dark:border-[#233648] p-4 rounded-xl rounded-tl-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white font-bold text-sm">Jordan Smith</span>
                    <span className="text-slate-400 dark:text-[#92adc9] text-xs">• 1 hour ago</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Verified Explanation
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Think of the chain rule as "peeling an onion." To find the gradient for the weights in layer <span className="bg-slate-100 dark:bg-[#233648] px-1 rounded font-mono">L</span>, you need the error term from layer <span className="bg-slate-100 dark:bg-[#233648] px-1 rounded font-mono">L+1</span>.
                  <br /><br />
                  The partial derivative is basically: <span className="italic">(Output Error) × (Activation Derivative) × (Input from Previous Layer)</span>. Check out 3Blue1Brown's Chapter 4 on Deep Learning, it makes it super visual!
                </p>
              </div>
              <div className="flex items-center gap-4 px-2">
                <button className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
                  <span>8 Helpful</span>
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-[#92adc9]">
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comment 2 (Nested) */}
          <div className="flex gap-4 ml-14 group">
            <div className="shrink-0">
              <img className="w-8 h-8 rounded-full bg-slate-200" data-alt="Student Sarah profile photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG8lnO-acF3udez8iyi7C9ei-D99t-W21Ny5_r7c9FUr6u7G3XTOHLJPtKrk9fTadgqFCzvUluHEaF2IbsN64gPVkGB5MVsmfOiDj1-85Yl3X_3gpUswnr1vy1xjCxHj1AxTuUDWFDQ_zXWerVk7lSb2AJtchoWdqg-d0B9lKsuqCTx8OS801AIxfnrHJcvfHWhWXvED9xJEOuOLM_c-P2R8Tftc3LRDVLHByr1w2-iIU1GHyAWyWx3fVY4oVfXsNhEPgyqp_Mag" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="bg-white dark:bg-[#192633] border border-slate-100 dark:border-[#233648] p-4 rounded-xl rounded-tl-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white font-bold text-sm">Sarah Chen</span>
                    <span className="text-slate-400 dark:text-[#92adc9] text-xs">• 45 mins ago</span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  +1 for the onion analogy. Also Alex, don't forget that if you're using ReLU, the derivative is either 0 or 1, which simplifies things a lot compared to Sigmoid!
                </p>
              </div>
              <div className="flex items-center gap-4 px-2">
                <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-[#92adc9]">
                  <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
                  <span>2</span>
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-[#92adc9]">
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comment 3 */}
          <div className="flex gap-4 group">
            <div className="shrink-0">
              <img className="w-10 h-10 rounded-full bg-slate-200" data-alt="Student Marcus profile photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0MhrCpgEWjP2SyKAb2ZcvISnHzyH7ewRN0jR_CMTjDR9heo4DkacDmrsa8vqatkYsGo7-t7fhnA1GZnVT2OT7SzHpfGhgFqU98Oyti5hvliM6tTg-kv7JWFJq9YAQ81oP1mc79nB0YenQ4HgS4VC-7s5aMo7Y5bNLih8S5NWqofCo74k8EZuaYWVAJqSDx1Jh71HP4cOSwK7HlNdCwKLMXmOHGbHh56m5ebCGP2rR37zvruonJ1h4OBYMbNZuJVdQixBrmnoyIA" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="bg-white dark:bg-[#192633] border border-slate-100 dark:border-[#233648] p-4 rounded-xl rounded-tl-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white font-bold text-sm">Marcus V.</span>
                    <span className="text-slate-400 dark:text-[#92adc9] text-xs">• 12 mins ago</span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  I'm having the same issue actually. Does this account for bias updates as well or just weights?
                </p>
              </div>
              <div className="flex items-center gap-4 px-2">
                <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-[#92adc9]">
                  <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
                  <span>Helpful</span>
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-[#92adc9]">
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  <span>Reply</span>
                </button>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">
                  <span className="material-symbols-outlined text-[12px]">question_mark</span>
                  Seeking Info
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating/Sticky Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-[#233648] p-4 z-50">
        <div className="max-w-[960px] mx-auto flex items-end gap-3">
          <div className="flex-1 bg-slate-50 dark:bg-[#192633] border border-slate-200 dark:border-[#233648] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <textarea className="w-full bg-transparent border-none focus:ring-0 text-sm p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92adc9] resize-none" placeholder="Contribute to the academic discussion..." rows={1}></textarea>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-100/50 dark:bg-[#233648]/30">
              <div className="flex items-center gap-2">
                <button className="text-slate-400 dark:text-[#92adc9] hover:text-primary p-1 rounded transition-colors">
                  <span className="material-symbols-outlined text-[20px]">format_bold</span>
                </button>
                <button className="text-slate-400 dark:text-[#92adc9] hover:text-primary p-1 rounded transition-colors">
                  <span className="material-symbols-outlined text-[20px]">format_italic</span>
                </button>
                <button className="text-slate-400 dark:text-[#92adc9] hover:text-primary p-1 rounded transition-colors">
                  <span className="material-symbols-outlined text-[20px]">attach_file</span>
                </button>
                <div className="w-[1px] h-4 bg-slate-300 dark:bg-[#324d67] mx-1"></div>
                <button className="flex items-center gap-1 text-primary text-xs font-bold hover:bg-primary/10 px-2 py-1 rounded transition-colors">
                  <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                  AI Refine
                </button>
              </div>
              <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
                Post Comment
              </button>
            </div>
          </div>
          <div className="hidden sm:block">
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#233648] text-slate-400 dark:text-[#92adc9] hover:bg-slate-200 dark:hover:bg-[#324d67] transition-all">
              <span className="material-symbols-outlined">emoji_emotions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
