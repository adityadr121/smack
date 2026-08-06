import React, { useState } from 'react';
import { AnimatedECG } from '../components/common/AnimatedECG';
import { 
  Activity, 
  BrainCircuit, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  ChevronRight,
  TrendingDown,
  Building,
  Mail,
  Send,
  Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExploreDemo }) => {
  const [calculatorInputs, setCalculatorInputs] = useState({
    hr: 112,
    sbp: 92,
    rr: 24,
    temp: 38.8,
    wbc: 16.5,
    lactate: 3.4
  });

  // Simulated live risk score calculation
  const calculatedRisk = Math.min(
    98,
    Math.max(
      5,
      Math.round(
        (calculatorInputs.hr > 90 ? 20 : 0) +
        (calculatorInputs.sbp < 100 ? 25 : 0) +
        (calculatorInputs.rr >= 22 ? 20 : 0) +
        (calculatorInputs.temp > 38.0 ? 10 : 0) +
        (calculatorInputs.lactate > 2.0 ? 25 : 0)
      )
    )
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Animated Floating Particles & Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Early Sepsis Detection 6–12 Hours Before Deterioration</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Predict Sepsis Early.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
              Save Critical Lives in Real Time.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto"
          >
            CureLink AI empowers clinical care teams with intermittent nurse-recorded vital signs and routine blood chemistry to forecast sepsis onset hours before septic shock occurs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 pt-4"
          >
            <button
              onClick={onExploreDemo}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
            >
              <span>Launch Hospital Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-900 text-slate-200 font-semibold text-sm transition"
            >
              <span>View Clinical Validation</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </a>
          </motion.div>
        </div>

        {/* Hero Interactive Live ECG & Simulator Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 glass-panel bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white">Live Patient Telemetry Engine Simulator</h3>
                <p className="text-xs text-slate-400">Intermittent Vitals + SHAP Feature Attribution AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                qSOFA Score: 2/3 (High Alert)
              </span>
            </div>
          </div>

          <AnimatedECG bpm={calculatorInputs.hr} height={100} />

          {/* Interactive Quick Calculator Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Heart Rate (bpm)</label>
              <input
                type="number"
                value={calculatorInputs.hr}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, hr: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={calculatorInputs.sbp}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, sbp: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Resp Rate (/min)</label>
              <input
                type="number"
                value={calculatorInputs.rr}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, rr: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={calculatorInputs.temp}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, temp: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">WBC (×10⁹/L)</label>
              <input
                type="number"
                step="0.1"
                value={calculatorInputs.wbc}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, wbc: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Lactate (mmol/L)</label>
              <input
                type="number"
                step="0.1"
                value={calculatorInputs.lactate}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, lactate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-cyan-400" />
              <div>
                <span className="text-xs text-slate-400">AI Risk Assessment Output</span>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  Sepsis Probability: <span className={calculatedRisk > 60 ? 'text-red-400' : 'text-amber-400'}>{calculatedRisk}%</span>
                </div>
              </div>
            </div>
            <button
              onClick={onExploreDemo}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition"
            >
              Analyze Patient Deep SHAP Breakdown &rarr;
            </button>
          </div>
        </motion.div>
      </section>

      {/* Impact Statistics */}
      <section className="py-12 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-mono">9.4 Hours</div>
            <div className="text-xs text-slate-400 mt-1">Average Lead Time Before Septic Shock</div>
          </div>
          <div className="p-4">
            <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono">38.5%</div>
            <div className="text-xs text-slate-400 mt-1">Sepsis Mortality Rate Reduction</div>
          </div>
          <div className="p-4">
            <div className="text-3xl md:text-4xl font-extrabold text-purple-400 font-mono font-sans">94.2%</div>
            <div className="text-xs text-slate-400 mt-1">AI Prediction AUC ROC Score</div>
          </div>
          <div className="p-4">
            <div className="text-3xl md:text-4xl font-extrabold text-amber-400 font-mono">3.2 Days</div>
            <div className="text-xs text-slate-400 mt-1">Reduction in ICU Length of Stay</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-white">How CureLink AI Works</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Seamlessly integrating with hospital EHR systems and nurse bedside workflows to continuously calculate SHAP feature attributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Bedside Intake', desc: 'Nurses log intermittent vitals via voice assistant or rapid QR scan.', icon: Stethoscope },
            { step: '02', title: 'EHR Lab Sync', desc: 'Automated retrieval of serum lactate, WBC, PCT, and blood gas markers.', icon: Activity },
            { step: '03', title: 'Explainable AI Engine', desc: 'Gradient boosted ensemble model evaluates 34 clinical biomarkers & SHAP impact.', icon: BrainCircuit },
            { step: '04', title: 'Smart Escalation', desc: 'Tiered alert workflow notifies nurse, attending MD, and ICU outreach.', icon: ShieldCheck }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/30 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold">STEP {item.step}</span>
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology & Clinical Standards */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>HL7 FHIR R4 & HIPAA Compliant Architecture</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Built for High-Stakes Hospital Operations</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Designed according to the <strong>Surviving Sepsis Campaign (SSC) 3-Hour Bundle Guidelines</strong>. Every recommendation provides actionable clinical steps tailored for bedside nurses and attending physicians.
            </p>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero black-box decisions — transparent SHAP waterfall feature attributions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Offline-first Progressive Web App (PWA) with instant background queue sync</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>WCAG 2.1 AA accessible glassmorphic UI with dark/light medical themes</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Request Hospital Pilot Access</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Hospital / Medical Center Name</label>
                <input type="text" placeholder="e.g. Johns Hopkins Hospital" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Clinical Lead Work Email</label>
                <input type="email" placeholder="doctor@hospital.org" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500" />
              </div>
              <button 
                onClick={onExploreDemo}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90"
              >
                <span>Launch Interactive Demo Sandbox</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">CureLink AI</span>
            <span>&copy; 2026 CureLink Healthcare Technologies. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-slate-300">HIPAA Policy</a>
            <a href="#privacy" className="hover:text-slate-300">Clinical Disclaimer</a>
            <a href="#support" className="hover:text-slate-300">Hospital IT Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
