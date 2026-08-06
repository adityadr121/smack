import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  MapPin,
  GitCommit,
  Stethoscope,
  UserCheck,
  BrainCircuit,
  Radio,
  BellRing,
  FileBarChart,
  BarChart3,
  Bot,
  Settings,
  Sliders,
  FlaskConical,
  Users,
  Home,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  currentRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onNavigate,
  currentRole,
  isCollapsed,
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: 'landing', label: 'Product Landing', icon: Home, roles: ['admin', 'doctor', 'nurse', 'lab_tech'] },
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard, badge: 'HOT', roles: ['admin', 'doctor', 'nurse'] },
    { id: 'ward_heatmap', label: 'Ward Heatmap', icon: MapPin, roles: ['admin', 'doctor', 'nurse', 'lab_tech'] },
    { id: 'patient_management', label: 'Patient Directory', icon: Users, roles: ['admin', 'doctor', 'nurse', 'lab_tech'] },
    { id: 'prediction', label: 'Explainable AI', icon: BrainCircuit, badge: 'AI', roles: ['admin', 'doctor', 'nurse', 'lab_tech'] },
    { id: 'ai_simulation', label: 'What-If AI Sandbox', icon: Sliders, badge: 'NEW', roles: ['doctor', 'admin'] },
    { id: 'lab_module', label: 'Laboratory Diagnostics', icon: FlaskConical, roles: ['lab_tech', 'doctor', 'admin'] },
    { id: 'timeline', label: 'Patient Timeline', icon: GitCommit, roles: ['doctor', 'nurse'] },
    { id: 'nurse_workspace', label: 'Nurse Workspace', icon: Stethoscope, roles: ['nurse', 'admin'] },
    { id: 'doctor_workspace', label: 'Doctor Workspace', icon: UserCheck, roles: ['doctor', 'admin'] },
    { id: 'live_monitoring', label: 'Live Monitoring', icon: Radio, roles: ['doctor', 'nurse', 'admin'] },
    { id: 'smart_alerts', label: 'Smart Alerts', icon: BellRing, roles: ['admin', 'doctor', 'nurse'] },
    { id: 'reports', label: 'Reports & Export', icon: FileBarChart, roles: ['admin', 'doctor', 'nurse', 'lab_tech'] },
    { id: 'analytics', label: 'Hospital Analytics', icon: BarChart3, roles: ['admin', 'doctor'] },
    { id: 'assistant', label: 'AI Clinical Assistant', icon: Bot, roles: ['admin', 'doctor', 'nurse', 'lab_tech'] },
    { id: 'settings', label: 'System Settings', icon: Settings, roles: ['admin'] },
  ];

  return (
    <aside
      className={`relative z-30 transition-all duration-300 ease-in-out glass-panel bg-slate-950/90 border-r border-slate-800 flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Upper Navigation Links */}
      <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
        <div className={`px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'hidden' : 'block'}`}>
          Clinical Modules
        </div>

        {menuItems
          .filter((item) => item.roles.includes(currentRole))
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`btn-raw w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute right-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-l" />
                )}
              </button>
            );
          })}
      </div>

      {/* Collapse & Auth Toggle Footer */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={onToggleCollapse}
          className="btn-raw w-full flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {!isCollapsed && (
          <button
            onClick={() => onNavigate('auth')}
            className="btn-raw w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Authentication</span>
          </button>
        )}
      </div>
    </aside>
  );
};
