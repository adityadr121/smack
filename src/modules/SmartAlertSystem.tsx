import React, { useState } from 'react';
import { AlertItem, UserRole } from '../types';
import { BellRing, ShieldAlert, CheckCircle, Clock, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartAlertSystemProps {
  alerts: AlertItem[];
  currentRole: UserRole;
  onAcknowledgeAlert: (alertId: string) => void;
}

export const SmartAlertSystem: React.FC<SmartAlertSystemProps> = ({
  alerts,
  currentRole,
  onAcknowledgeAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'active') return a.status !== 'resolved';
    return a.status === 'resolved';
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-400">
            <BellRing className="w-4 h-4 animate-bounce" />
            <span>TIERED SEPSIS SMART ESCALATION SYSTEM</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Clinical Escalation & Alert Center</h1>
          <p className="text-xs text-slate-400">
            AI Trigger &rarr; Nurse Alert (5m) &rarr; Doctor Escalation &rarr; Chief Medical Officer
          </p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-lg transition font-bold ${
              activeTab === 'active' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400'
            }`}
          >
            Active Escalations ({alerts.filter((a) => a.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-1.5 rounded-lg transition font-bold ${
              activeTab === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            Resolved Log
          </button>
        </div>
      </div>

      {/* Escalation Workflow Diagram Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Automated 3-Tier Escalation Protocol</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-cyan-400">STEP 1</span>
            <div className="font-bold text-white">AI Detection</div>
            <p className="text-[10px] text-slate-400">Probability &gt; 65% or qSOFA &ge; 2</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-emerald-400">STEP 2</span>
            <div className="font-bold text-white">Bedside Nurse Alert</div>
            <p className="text-[10px] text-slate-400">5-minute acknowledgment window</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-amber-400">STEP 3</span>
            <div className="font-bold text-white">Doctor Escalation</div>
            <p className="text-[10px] text-slate-400">Pushes stat care bundle orders</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono text-purple-400">STEP 4</span>
            <div className="font-bold text-white">CMO / Rapid Outreach</div>
            <p className="text-[10px] text-slate-400">Unresolved after 15 minutes</p>
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
                    Escalated To: {alert.escalationLevel}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {alert.description}
              </p>

              <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800">
                <div className="text-slate-400">
                  Status:{' '}
                  <strong className={isAck ? 'text-cyan-300' : 'text-red-400'}>
                    {alert.status.replace('_', ' ').toUpperCase()}
                  </strong>
                  {alert.acknowledgedBy && (
                    <span className="ml-2 text-slate-400">
                      (by <strong>{alert.acknowledgedBy}</strong> {alert.acknowledgedTime})
                    </span>
                  )}
                </div>

                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Acknowledge & Mark Handled
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
