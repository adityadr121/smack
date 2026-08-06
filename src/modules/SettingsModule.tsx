import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Shield, 
  Sliders, 
  UserPlus, 
  CheckCircle2, 
  Lock, 
  UserX, 
  UserCheck, 
  KeyRound, 
  Users, 
  Building2,
  AlertCircle
} from 'lucide-react';

interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const SettingsModule: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(85);
  const [leadWindow, setLeadWindow] = useState(12);

  // Hospital Staff Roster State
  const [staffRoster, setStaffRoster] = useState<StaffUser[]>([
    { id: 'usr-md-101', fullName: 'Dr. Sarah Jenkins, MD', email: 'doctor@hospital.com', role: 'doctor', department: 'Intensive Care Unit', status: 'ACTIVE' },
    { id: 'usr-rn-201', fullName: 'RN Marcus Vance', email: 'nurse@hospital.com', role: 'nurse', department: 'Intensive Care Unit', status: 'ACTIVE' },
    { id: 'usr-cls-301', fullName: 'CLS Priya Sharma', email: 'lab@hospital.com', role: 'lab_tech', department: 'Laboratory Diagnostics', status: 'ACTIVE' },
    { id: 'usr-md-102', fullName: 'Dr. Robert Chen, MD', email: 'r.chen@hospital.com', role: 'doctor', department: 'Emergency Medicine', status: 'ACTIVE' }
  ]);

  // Admin Staff Provisioning Form State
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    email: '',
    password: 'Staff@123',
    role: 'doctor' as UserRole,
    department: 'Intensive Care Unit'
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffForm.fullName.trim() || !staffForm.email.trim()) {
      showNotification('error', 'Please enter full name and email address.');
      return;
    }

    const newStaff: StaffUser = {
      id: `usr-${Date.now()}`,
      fullName: staffForm.fullName,
      email: staffForm.email.trim().toLowerCase(),
      role: staffForm.role,
      department: staffForm.department,
      status: 'ACTIVE'
    };

    setStaffRoster((prev) => [newStaff, ...prev]);
    showNotification('success', `Staff account created for ${staffForm.fullName} (${staffForm.role.toUpperCase()}). Initial password: ${staffForm.password}`);

    setStaffForm({
      fullName: '',
      email: '',
      password: 'Staff@123',
      role: 'doctor',
      department: 'Intensive Care Unit'
    });
  };

  const toggleStaffStatus = (id: string) => {
    setStaffRoster((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showNotification(
            newStatus === 'ACTIVE' ? 'success' : 'error',
            `Account for ${s.fullName} is now ${newStatus}`
          );
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const resetStaffPassword = (id: string, name: string) => {
    showNotification('success', `Password for ${name} has been reset to "Reset@123"`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          Hospital Administration & Staff Access Control
        </h1>
        <p className="text-xs text-slate-400">
          Provision clinical staff accounts, activate/deactivate personnel access, reset passwords, and set AI alarm thresholds.
        </p>
      </div>

      {/* Global Status Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
            : 'bg-red-500/20 border-red-500/50 text-red-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Hospital Admin Staff Account Creation Form (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <UserPlus className="w-5 h-5" />
            <span>Hospital Admin: Provision Staff Credentials</span>
          </div>

          <p className="text-xs text-slate-400">
            Doctors, Nurses, and Lab Technicians cannot self-register. Accounts must be provisioned by the Hospital Admin.
          </p>

          <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Staff Full Name</label>
              <input
                type="text"
                placeholder="Dr. Elizabeth Vance, MD"
                value={staffForm.fullName}
                onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Institutional Email</label>
              <input
                type="email"
                placeholder="e.vance@hospital.com"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Role Assignment</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as UserRole })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="doctor">Doctor (MD/DO)</option>
                  <option value="nurse">Clinical Nurse (RN)</option>
                  <option value="lab_tech">Lab Specialist (CLS)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Department</label>
                <select
                  value={staffForm.department}
                  onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <option>Intensive Care Unit</option>
                  <option>Emergency Medicine</option>
                  <option>Progressive Care 3B</option>
                  <option>Laboratory Diagnostics</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Initial Password</label>
              <input
                type="text"
                value={staffForm.password}
                onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              Create Account & Dispatch Credentials
            </button>
          </form>
        </div>

        {/* Right: Hospital Staff Roster Control Table (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Hospital Staff Roster & Access Rights ({staffRoster.length})</span>
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              Admin Roster Management
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {staffRoster.map((staff) => (
              <div
                key={staff.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{staff.fullName}</span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        staff.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-red-500/20 border-red-500/40 text-red-400'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{staff.email} • {staff.department}</div>
                  <div className="text-[10px] text-cyan-400 font-mono uppercase">Role: {staff.role}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resetStaffPassword(staff.id, staff.fullName)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
                    title="Reset Password"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleStaffStatus(staff.id)}
                    className={`px-2.5 py-1.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 transition ${
                      staff.status === 'ACTIVE'
                        ? 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                    }`}
                  >
                    {staff.status === 'ACTIVE' ? (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Sensitivity & Threshold Settings Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
          <Sliders className="w-5 h-5" />
          <span>AI Risk Sensitivity & Alarm Limits</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>AI Sensitivity Threshold</span>
              <span className="text-cyan-400 font-mono font-bold">{sensitivity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Higher sensitivity triggers early alerts on subtle vital changes.</p>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Max Prediction Lead Window</span>
              <span className="text-cyan-400 font-mono font-bold">{leadWindow} Hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              value={leadWindow}
              onChange={(e) => setLeadWindow(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
