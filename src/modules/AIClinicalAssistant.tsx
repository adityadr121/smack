import React, { useState } from 'react';
import { Patient } from '../types';
import { Bot, Send, Sparkles, User, ShieldAlert, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIClinicalAssistantProps {
  selectedPatient: Patient;
}

export const AIClinicalAssistant: React.FC<AIClinicalAssistantProps> = ({ selectedPatient }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your CureLink AI Clinical Copilot. Currently viewing ${selectedPatient.name} (MRN: ${selectedPatient.mrn}, Ward: ${selectedPatient.ward}). How can I assist your clinical workflow today?`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    `Explain SHAP score drivers for ${selectedPatient.name}`,
    `Summarize ${selectedPatient.name}'s 3-hour care bundle status`,
    `What are the recommended next vital observations?`,
    `Explain clinical significance of Lactate ${selectedPatient.labHistory[selectedPatient.labHistory.length - 1]?.lactate || 4.2} mmol/L`
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = { sender: 'user' as const, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      let aiReply = '';
      if (text.toLowerCase().includes('shap') || text.toLowerCase().includes('drivers')) {
        aiReply = `For ${selectedPatient.name}, the top SHAP feature attribution driver is Serum Lactate (${selectedPatient.labHistory[selectedPatient.labHistory.length - 1]?.lactate || 4.2} mmol/L), contributing +32% to the sepsis risk score due to systemic hypoperfusion. Followed by MAP (58 mmHg, +26%) and WBC (${selectedPatient.labHistory[selectedPatient.labHistory.length - 1]?.wbc || 19.8}k, +18%).`;
      } else if (text.toLowerCase().includes('bundle') || text.toLowerCase().includes('care')) {
        aiReply = `Surviving Sepsis Campaign 3-Hour Bundle Status for ${selectedPatient.name}:\n• Blood Cultures: ${selectedPatient.treatmentBundleStatus.bloodCultureDrawn ? '✓ Completed' : 'Pending'}\n• Broad-Spectrum Antibiotics: ${selectedPatient.treatmentBundleStatus.broadSpectrumAntibioticsGiven ? '✓ Administered' : 'Action Required'}\n• IV Fluids: ${selectedPatient.treatmentBundleStatus.ivFluidsAdministered ? '✓ In Progress' : '30 mL/kg Bolus Recommended'}`;
      } else {
        aiReply = `Based on current telemetry and lab parameters for ${selectedPatient.name}, the AI calculated Sepsis Probability is ${selectedPatient.currentPrediction.sepsisProbability}% with an estimated deterioration lead-time window of ${selectedPatient.currentPrediction.deteriorationWindowHours} hours. Recommended next step: Re-assess serum lactate in 2 hours and verify central line access.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Clinical Copilot & Decision Assistant</h1>
            <p className="text-xs text-slate-400">Context-Aware Guidance for Patient {selectedPatient.name}</p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
          Context Active: {selectedPatient.mrn}
        </span>
      </div>

      {/* Permanent Medical Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Clinical Disclaimer:</strong> This AI Clinical Assistant provides decision support guidance based on SSC guidelines. It does NOT replace professional medical diagnosis or human clinical judgment.
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user' ? 'bg-cyan-500 text-white' : 'bg-slate-900 border border-cyan-500/40 text-cyan-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 whitespace-pre-line'
              }`}>
                <p>{msg.text}</p>
                <span className="text-[10px] opacity-60 block mt-1 text-right">{msg.time}</span>
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing patient EHR parameters & SHAP matrix...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs font-medium transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI Copilot about patient vitals, SHAP score, dosage recommendations..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold transition shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
