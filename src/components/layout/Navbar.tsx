import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Activity, 
  Bell, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Moon, 
  Sun, 
  Sliders, 
  LogOut,
  Radio,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CureLinkLogo } from '../common/CureLinkLogo';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeModule: string;
  onNavigate: (module: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  unreadAlertCount: number;
  onOpenAssistant: () => void;
  onSearchOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeModule,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  unreadAlertCount,
  onOpenAssistant,
  onSearchOpen,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: string; badge: string }> = {
    admin: { label: 'Hospital Administrator', icon: '🏥', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    doctor: { label: 'Attending Physician (MD)', icon: '🩺', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    nurse: { label: 'Clinical Staff Nurse (RN)', icon: '👩‍⚕️', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    lab_tech: { label: 'Lab Specialist (CLS)', icon: '🔬', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand & Module indicator */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('landing')}
            className="btn-raw flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <CureLinkLogo size={36} showText={true} />
          </button>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400">
              LIVE CLINICAL ENGINE ACTIVE
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Global Search button */}
          <button
            onClick={onSearchOpen}
            className="btn-raw hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Patient MRN, Ward, Vitals...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Role & Account Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`btn-raw flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${roleLabels[currentRole].badge}`}
            >
              <span>{roleLabels[currentRole].icon}</span>
              <span className="hidden sm:inline">{user ? user.name : roleLabels[currentRole].label}</span>
              <Sliders className="w-3.5 h-3.5 opacity-70" />
            </button>

            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 glass-panel bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl z-50 space-y-1"
                >
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Operational Role
                  </div>
                  {(['admin', 'doctor', 'nurse', 'lab_tech'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`btn-raw w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                        currentRole === r
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{roleLabels[r].icon}</span>
                        <span>{roleLabels[r].label}</span>
                      </div>
                      {currentRole === r && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}

                  {isAuthenticated && (
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          onNavigate('auth');
                          setRoleDropdownOpen(false);
                        }}
                        className="btn-raw w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 font-bold transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out & Lock Session</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sepsis Assistant Quick Trigger */}
          <button
            onClick={onOpenAssistant}
            className="btn-raw flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 text-xs font-semibold shadow-sm transition"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Notification Alerts Bell */}
          <button
            onClick={() => onNavigate('smart_alerts')}
            className="btn-raw relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Active Sepsis Alerts"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn-raw p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
