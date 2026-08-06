import React, { useState, useEffect } from 'react';
import { UserRole, Patient, VitalSignRecord, LabResult, WardBed, AlertItem } from './types';
import { INITIAL_PATIENTS, INITIAL_BEDS, INITIAL_ALERTS } from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './modules/LandingPage';
import { AuthModule } from './modules/AuthModule';
import { CommandCenter } from './modules/CommandCenter';
import { WardHeatmap } from './modules/WardHeatmap';
import { PatientTimeline } from './modules/PatientTimeline';
import { NurseWorkspace } from './modules/NurseWorkspace';
import { DoctorWorkspace } from './modules/DoctorWorkspace';
import { AIPredictionScreen } from './modules/AIPredictionScreen';
import { LiveMonitoring } from './modules/LiveMonitoring';
import { SmartAlertSystem } from './modules/SmartAlertSystem';
import { ReportsModule } from './modules/ReportsModule';
import { HospitalAnalytics } from './modules/HospitalAnalytics';
import { AIClinicalAssistant } from './modules/AIClinicalAssistant';
import { SettingsModule } from './modules/SettingsModule';
import { AISimulationModule } from './modules/AISimulationModule';
import { LaboratoryModule } from './modules/LaboratoryModule';
import { PatientManagement } from './modules/PatientManagement';
import { useAuth } from './contexts/AuthContext';
import { api } from './services/api';
import { Search, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Default unauthenticated route is 'auth' (Login Page)
  const [activeModule, setActiveModuleState] = useState<string>('auth');
  const [currentRole, setCurrentRole] = useState<UserRole>(user ? user.role : 'doctor');

  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [beds, setBeds] = useState<WardBed[]>(INITIAL_BEDS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const unreadAlertCount = alerts.filter((a) => a.status === 'active').length;

  // Fetch patient EHR records from backend API upon authentication
  useEffect(() => {
    if (isAuthenticated) {
      api.getPatients()
        .then((fetchedPatients) => {
          if (fetchedPatients && fetchedPatients.length > 0) {
            setPatients(fetchedPatients);
            setSelectedPatient(fetchedPatients[0]);
          }
        })
        .catch((err) => {
          console.warn('Backend API patient fetch error, falling back to local dataset:', err);
        });
    }
  }, [isAuthenticated]);

  // Sync role with logged-in user
  useEffect(() => {
    if (user) {
      setCurrentRole(user.role);
    }
  }, [user]);

  // Synchronize document light/dark theme class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  // Protected Routes Navigation Guard
  const setActiveModule = (module: string) => {
    if (!isAuthenticated && module !== 'auth' && module !== 'landing') {
      setActiveModuleState('auth');
      return;
    }
    if (isAuthenticated && module === 'auth') {
      setActiveModuleState('command_center');
      return;
    }
    setActiveModuleState(module);
  };

  // Redirect logic when auth status changes
  useEffect(() => {
    if (!isAuthenticated && activeModule !== 'landing') {
      setActiveModuleState('auth');
    } else if (isAuthenticated && activeModule === 'auth') {
      setActiveModuleState('command_center');
    }
  }, [isAuthenticated]);

  // Global Keyboard Shortcut (⌘K / Ctrl+K) for Search Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddVitalRecord = (patientId: string, vitals: VitalSignRecord) => {
    // Send to backend API asynchronously
    api.addVitals({ patientId, ...vitals }).catch((err) => console.error('Failed to log vitals to backend:', err));

    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id === patientId) {
          const updatedVitals = [...p.vitalHistory, vitals];
          let newRiskProb = p.currentPrediction.sepsisProbability;
          if (vitals.heartRate > 115 || vitals.sysBP < 90 || vitals.temperature > 38.8) {
            newRiskProb = Math.min(99.4, newRiskProb + 8.5);
          }
          return {
            ...p,
            vitalHistory: updatedVitals,
            currentPrediction: {
              ...p.currentPrediction,
              sepsisProbability: Number(newRiskProb.toFixed(1)),
              qSofaScore: (vitals.sysBP <= 100 ? 1 : 0) + (vitals.respRate >= 22 ? 1 : 0) + (vitals.avpu !== 'Alert' ? 1 : 0)
            }
          };
        }
        return p;
      })
    );
  };

  const handleAddLabResult = (patientId: string, lab: LabResult) => {
    // Send to backend API asynchronously
    api.addLabResult({ patientId, ...lab }).catch((err) => console.error('Failed to log lab result to backend:', err));

    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id === patientId) {
          const updatedLabs = [...p.labHistory, lab];
          let newRiskProb = p.currentPrediction.sepsisProbability;
          if (lab.lactate > 3.0 || lab.wbc > 15.0) {
            newRiskProb = Math.min(99.8, newRiskProb + 12.0);
          }
          return {
            ...p,
            labHistory: updatedLabs,
            currentPrediction: {
              ...p.currentPrediction,
              sepsisProbability: Number(newRiskProb.toFixed(1))
            }
          };
        }
        return p;
      })
    );
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved', acknowledgedBy: user?.name || 'Clinical User' } : a))
    );
  };

  const searchResults = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ward.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors pb-14 md:pb-0 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'light-theme bg-slate-100 text-slate-900'}`}>
      {/* Top Bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeModule={activeModule}
        onNavigate={setActiveModule}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        unreadAlertCount={unreadAlertCount}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      {/* Main Workspace Area with Collapsible Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          activeModule={activeModule}
          onNavigate={setActiveModule}
          currentRole={currentRole}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Module Content View */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeModule === 'landing' && (
            <LandingPage onExploreDemo={() => setActiveModule(isAuthenticated ? 'command_center' : 'auth')} />
          )}

          {activeModule === 'auth' && (
            <AuthModule
              onLoginSuccess={() => {
                setActiveModule('command_center');
              }}
            />
          )}

          {/* Protected Routes (Only rendered if authenticated) */}
          {isAuthenticated && activeModule === 'command_center' && (
            <CommandCenter
              patients={patients}
              alerts={alerts}
              currentRole={currentRole}
              onNavigate={setActiveModule}
              onSelectPatient={setSelectedPatient}
            />
          )}

          {isAuthenticated && activeModule === 'ward_heatmap' && (
            <WardHeatmap
              beds={beds}
              onSelectPatient={setSelectedPatient}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'patient_management' && (
            <PatientManagement
              patients={patients}
              onSelectPatient={setSelectedPatient}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'timeline' && (
            <PatientTimeline
              patient={selectedPatient}
              patients={patients}
              onSelectPatient={setSelectedPatient}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'nurse_workspace' && (
            <NurseWorkspace
              patients={patients}
              onAddVitalRecord={handleAddVitalRecord}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'doctor_workspace' && (
            <DoctorWorkspace
              patients={patients}
              onSelectPatient={setSelectedPatient}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'prediction' && (
            <AIPredictionScreen
              patient={selectedPatient}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'ai_simulation' && (
            <AISimulationModule patients={patients} />
          )}

          {isAuthenticated && activeModule === 'lab_module' && (
            <LaboratoryModule patients={patients} onAddLabResult={handleAddLabResult} />
          )}

          {isAuthenticated && activeModule === 'live_monitoring' && (
            <LiveMonitoring
              patients={patients}
              alerts={alerts}
              onSelectPatient={setSelectedPatient}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'smart_alerts' && (
            <SmartAlertSystem
              alerts={alerts}
              currentRole={currentRole}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onNavigate={setActiveModule}
            />
          )}

          {isAuthenticated && activeModule === 'reports' && (
            <ReportsModule patients={patients} />
          )}

          {isAuthenticated && activeModule === 'analytics' && (
            <HospitalAnalytics />
          )}

          {isAuthenticated && activeModule === 'assistant' && (
            <AIClinicalAssistant selectedPatient={selectedPatient} />
          )}

          {isAuthenticated && activeModule === 'settings' && (
            <SettingsModule />
          )}
        </main>
      </div>

      {/* Touch-Optimized Mobile Bottom Bar */}
      <MobileNav
        activeModule={activeModule}
        onNavigate={setActiveModule}
        currentRole={currentRole}
        unreadAlertCount={unreadAlertCount}
      />

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="glass-panel bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full p-4 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                <Search className="w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search Patient Name, MRN, Ward, or Diagnosis (⌘K)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                  autoFocus
                />
                <button onClick={() => setIsSearchOpen(false)} className="btn-raw text-slate-400 hover:text-white" aria-label="Close search">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setActiveModule('prediction');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <div className="font-bold text-white">{p.name} ({p.mrn})</div>
                      <div className="text-slate-400">{p.ward} • {p.bedNumber} — {p.primaryDiagnosis}</div>
                    </div>
                    <span className="font-mono font-bold text-cyan-400">{p.currentPrediction.sepsisProbability}% Risk</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Assistant Drawer Launcher Modal */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-4 right-4 z-50 w-full max-w-md glass-panel bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Clinical Copilot Drawer</span>
              </div>
              <button onClick={() => setIsAssistantOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close assistant">
                <X className="w-4 h-4" />
              </button>
            </div>
            <AIClinicalAssistant selectedPatient={selectedPatient} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
