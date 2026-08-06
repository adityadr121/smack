import React from 'react';
import { UserRole } from '../../types';
import { LayoutDashboard, MapPin, BrainCircuit, Stethoscope, UserCheck, Bell } from 'lucide-react';

interface MobileNavProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  currentRole: UserRole;
  unreadAlertCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeModule,
  onNavigate,
  currentRole,
  unreadAlertCount,
}) => {
  const navItems = [
    { id: 'command_center', label: 'Command', icon: LayoutDashboard },
    { id: 'ward_heatmap', label: 'Heatmap', icon: MapPin },
    { id: 'prediction', label: 'AI Risk', icon: BrainCircuit },
    { id: 'nurse_workspace', label: 'Nurse', icon: Stethoscope },
    { id: 'doctor_workspace', label: 'Doctor', icon: UserCheck },
    { id: 'smart_alerts', label: 'Alerts', icon: Bell, badge: unreadAlertCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel bg-slate-950/95 border-t border-slate-800 px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition text-[10px] font-medium relative ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-label={item.label}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 right-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-[9px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
