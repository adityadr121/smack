import React, { useState } from 'react';
import { AlertItem, UserRole } from '../types';
import { BellRing, ShieldAlert, CheckCircle, Clock, ArrowRight, UserCheck, AlertTriangle, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartAlertSystemProps {
  alerts: AlertItem[];
  currentRole: UserRole;
  onAcknowledgeAlert: (alertId: string) => void;
  onNavigate?: (module: string) => void;
}

export const SmartAlertSystem: React.FC<SmartAlertSystemProps> = ({
  alerts,
  currentRole,
  onAcknowledgeAlert,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'active') return a.status !== 'resolved';
    return a.status === 'resolved';
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase">
            <BellRing className="w-4 h-4 animate-bounce" />
            <span>TIERED SEPSIS SMART ESCALATION & 2-HR VITALS SYSTEM</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Clinical Escalation & Alert Center</h1>
          <p className="text-xs text-slate-400">
            AI Trigger &rarr; 2-Hour Vital Intake &rarr; Nurse Alert (5m) &rarr; Attending MD Escalation &rarr; Rapid Response Team
          </p>
        </div>

        <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs relative z-10">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg transition font-bold ${
              activeTab === 'active' ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm' : 'text-slate-400'
            }`}
          >
            Active Escalations ({alerts.filter((a) => a.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 rounded-lg transition font-bold ${
              activeTab === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'text-slate-400'
            }`}
          >
            Resolved Log
          </button>
        </div>
      </div>

      {/* 2-Hour Intermittent Vitals Overdue Warning Notification Box */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-amber-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase font-mono">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>2-Hour Intermittent Telemetry Protocol Active</span>
          </div>
          <span className="text-[10px] font-mono text-slate-300">Target Interval: 120 Minutes</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          ICU & Ward clinical guidelines require vital signs to be updated every 2 hours. If vitals are not updated within 120 minutes of the previous cycle, the system automatically escalates an urgent intake alert to the assigned nurse.
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('nurse_workspace')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Open Nurse Workspace & Record 2-Hour Vitals</span>
          </button>
        )}
      </div>

      {/* Escalation Workflow Diagram Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Automated 4-Tier Escalation Protocol</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-cyan-400">STEP 1</span>
            <div className="font-bold text-white">AI Sepsis Risk Detection</div>
            <p className="text-[10px] text-slate-400">Probability &gt; 65% or qSOFA &ge; 2</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-amber-400">STEP 2</span>
            <div className="font-bold text-white">2-Hour Vital Intake Overdue</div>
            <p className="text-[10px] text-slate-400">Timer &gt; 120 mins since last cycle</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-emerald-400">STEP 3</span>
            <div className="font-bold text-white">Bedside Nurse Alert</div>
            <p className="text-[10px] text-slate-400">5-minute acknowledgment window</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-purple-400">STEP 4</span>
            <div className="font-bold text-white">Attending MD / Rapid Outreach</div>
            <p className="text-[10px] text-slate-400">Pushes stat care bundle orders</p>
          </div>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isAck = alert.status === 'nurse_acknowledged' || alert.status === 'doctor_notified';

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel p-5 rounded-2xl border transition space-y-3 ${
                isCritical
                  ? 'border-red-500/50 bg-red-950/20'
                  : 'border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-6 h-6 ${isCritical ? 'text-red-400 heart-beat-anim' : 'text-amber-400'}`} />
                  <div>
                    <h3 className="text-base font-bold text-white">{alert.title}</h3>
                    <p className="text-xs text-slate-300">
                      {alert.patientName} — {alert.ward} ({alert.bedNumber})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {alert.timestamp}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border ${
                    isCritical ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                {alert.message}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs font-mono text-slate-400">
                  Status: <span className="text-cyan-300 font-bold">{alert.status.replace('_', ' ').toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('nurse_workspace')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Record 2-Hr Vitals</span>
                    </button>
                  )}

                  {!isAck && alert.status !== 'resolved' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Acknowledge Alert</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
