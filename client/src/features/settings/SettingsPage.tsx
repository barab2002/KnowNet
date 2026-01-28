import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export const SettingsPage = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <section className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4">
        <h3 className="font-semibold mb-2">Appearance</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Choose your preferred theme for the app.</p>

        <div className="flex items-center gap-3">
          <label className={`px-3 py-2 rounded-lg border ${theme === 'light' ? 'bg-primary/5 border-primary' : 'bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-slate-800'} cursor-pointer`}>
            <input className="hidden" type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} />
            Light
          </label>

          <label className={`px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-primary/5 border-primary' : 'bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-slate-800'} cursor-pointer`}>
            <input className="hidden" type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
            Dark
          </label>

          <label className={`px-3 py-2 rounded-lg border ${theme === 'system' ? 'bg-primary/5 border-primary' : 'bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-slate-800'} cursor-pointer`}>
            <input className="hidden" type="radio" name="theme" checked={theme === 'system'} onChange={() => setTheme('system')} />
            System
          </label>

          {/* Toggle button removed: theme selection uses radio buttons */}
        </div>
      </section>

      <section className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <h3 className="font-semibold mb-2">Other Settings</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">More settings can be added here.</p>
      </section>
    </div>
  );
};

export default SettingsPage;
