import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { api } from '../services/api';

export const HospitalAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    avgLeadTimeHours: 9.4,
    avgCareTeamResponseMinutes: 8.2,
    threeHourBundleCompliancePercent: 96.4,
    sepsisMortalityDropPercent: 38.5
  });

  useEffect(() => {
    api.getHospitalAnalytics()
      .then((data) => {
        if (data) {
          setMetrics(data);
        }
      })
      .catch((err) => console.warn('Could not load dynamic hospital analytics:', err));
  }, []);

  const monthlyData = [
    { month: 'Jan', sepsisAlerts: 42, earlyInterventions: 38, mortalityRate: 14.2 },
    { month: 'Feb', sepsisAlerts: 48, earlyInterventions: 45, mortalityRate: 11.8 },
    { month: 'Mar', sepsisAlerts: 39, earlyInterventions: 37, mortalityRate: 9.5 },
    { month: 'Apr', sepsisAlerts: 52, earlyInterventions: 50, mortalityRate: 8.1 },
    { month: 'May', sepsisAlerts: 45, earlyInterventions: 44, mortalityRate: 6.4 },
    { month: 'Jun', sepsisAlerts: 58, earlyInterventions: 56, mortalityRate: 5.2 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BarChart3 className="w-4 h-4" />
            <span>EXECUTIVE HOSPITAL QUALITY ANALYTICS</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Sepsis Program Operational Performance</h1>
          <p className="text-xs text-slate-400">Surviving Sepsis Bundle Compliance • Mortality Drop • Response Time Metrics</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <TrendingUp className="w-4 h-4" />
          <span>Mortality Reduced by {metrics.sepsisMortalityDropPercent}% YTD</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-mono block mb-1">Avg Lead Time Alert</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">{metrics.avgLeadTimeHours} Hours</span>
          <span className="text-[10px] text-slate-400 block mt-1">Before Clinical Collapse</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-mono block mb-1">Care Team Response Time</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">{metrics.avgCareTeamResponseMinutes} Minutes</span>
          <span className="text-[10px] text-slate-400 block mt-1">From AI Alert to Antibiotic</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-mono block mb-1">3-Hr Bundle Compliance</span>
          <span className="text-2xl font-extrabold text-purple-400 font-mono">{metrics.threeHourBundleCompliancePercent}%</span>
          <span className="text-[10px] text-slate-400 block mt-1">SSC Guidelines Met</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-mono block mb-1">ICU Length of Stay Drop</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">-3.2 Days</span>
          <span className="text-[10px] text-slate-400 block mt-1">Average per Patient</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Sepsis Early Interventions */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Monthly Sepsis Alerts & Early Interventions</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="sepsisAlerts" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Sepsis Alerts" />
                <Bar dataKey="earlyInterventions" fill="#10B981" radius={[4, 4, 0, 0]} name="Early Interventions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: In-Hospital Mortality Drop Trend */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Sepsis In-Hospital Mortality Rate (%)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMortality" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="mortalityRate" stroke="#10B981" fillOpacity={1} fill="url(#colorMortality)" name="Mortality Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
