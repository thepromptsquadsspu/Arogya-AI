import React, { useState, useEffect } from 'react';
import { 
  Bot, User, Mic, MicOff, Plus, Trash2, ArrowRight, Sparkles, 
  AlertTriangle, RefreshCw, CheckCircle2, HelpCircle, Search, Volume2 
} from 'lucide-react';

const COMMON_SYMPTOMS_LIST = [
  { key: "chest_pain", label: "Chest Pain", category: "Cardiovascular" },
  { key: "shortness_of_breath", label: "Shortness of Breath", category: "Respiratory" },
  { key: "high_fever", label: "High Fever (>101°F)", category: "General" },
  { key: "dry_cough", label: "Dry Cough", category: "Respiratory" },
  { key: "productive_cough", label: "Productive Cough (Mucus)", category: "Respiratory" },
  { key: "pain_radiating_to_left_arm", label: "Pain Radiating to Left Arm", category: "Cardiovascular" },
  { key: "facial_droop", label: "Facial Droop", category: "Neurological" },
  { key: "slurred_speech", label: "Slurred Speech", category: "Neurological" },
  { key: "arm_weakness", label: "Arm / Leg Weakness", category: "Neurological" },
  { key: "throbbing_headache", label: "Throbbing Headache", category: "Neurological" },
  { key: "severe_sudden_headache", label: "Sudden Severe Headache", category: "Neurological" },
  { key: "body_aches", label: "Widespread Body Aches", category: "General" },
  { key: "chills", label: "Chills / Rigors", category: "General" },
  { key: "stiff_neck", label: "Stiff Neck", category: "Neurological" },
  { key: "sensitivity_to_light", label: "Light Sensitivity", category: "Neurological" },
  { key: "loss_of_taste_smell", label: "Loss of Taste / Smell", category: "General" },
  { key: "burning_urination", label: "Burning Urination", category: "Urinary" },
  { key: "frequent_urination", label: "Frequent Urination", category: "Urinary" },
  { key: "burning_stomach_pain", label: "Burning Stomach Pain", category: "Digestive" },
  { key: "right_lower_quadrant_pain", label: "Lower Right Abdominal Pain", category: "Digestive" },
  { key: "nausea", label: "Nausea", category: "Digestive" },
  { key: "vomiting", label: "Vomiting", category: "Digestive" },
  { key: "runny_nose", label: "Runny Nose", category: "Respiratory" },
  { key: "sneezing", label: "Sneezing", category: "Respiratory" },
  { key: "sore_throat", label: "Sore Throat", category: "Respiratory" },
  { key: "fatigue", label: "Fatigue / Lethargy", category: "General" },
  { key: "dizziness", label: "Dizziness / Lightheadedness", category: "Neurological" },
  { key: "excessive_thirst", label: "Excessive Thirst", category: "General" },
  { key: "dry_mouth", label: "Dry Mouth", category: "General" },
  { key: "wheezing", label: "Wheezing Sound", category: "Respiratory" }
];

export default function SymptomCheckerPage({ initialSymptom, onSubmitSymptoms }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize selected symptom if passed from Landing Page
  useEffect(() => {
    if (initialSymptom) {
      addSymptom(initialSymptom);
    } else if (selectedSymptoms.length === 0) {
      setChatMessages([
        {
          sender: 'ai',
          text: "Hello! I am your AI Medical Triage Assistant. What symptoms are you experiencing today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [initialSymptom]);

  // Fetch intelligent follow-up questions whenever selectedSymptoms change
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      fetchFollowUpQuestions();
    }
  }, [selectedSymptoms]);

  const addSymptom = (symKey) => {
    if (!selectedSymptoms.includes(symKey)) {
      const updated = [...selectedSymptoms, symKey];
      setSelectedSymptoms(updated);
      
      const label = symKey.replace(/_/g, ' ').toUpperCase();
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'user',
          text: `I am experiencing: ${label}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const removeSymptom = (symKey) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symKey));
  };

  const fetchFollowUpQuestions = async () => {
    setIsLoadingFollowUp(true);
    setIsTyping(true);
    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_symptoms: selectedSymptoms,
          answered_symptoms: answeredQuestions
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFollowUpQuestions(data.follow_up_questions || []);
        
        if (data.follow_up_questions && data.follow_up_questions.length > 0) {
          const nextQ = data.follow_up_questions[0];
          setTimeout(() => {
            setIsTyping(false);
            setChatMessages(prev => {
              // Avoid repeating question if already asked
              if (prev.some(m => m.text === nextQ.question_text)) return prev;
              return [
                ...prev,
                {
                  sender: 'ai',
                  text: nextQ.question_text,
                  symptom_key: nextQ.symptom_key,
                  isQuestion: true,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ];
            });
          }, 600);
        } else {
          setIsTyping(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch follow-up questions:", err);
      setIsTyping(false);
    } finally {
      setIsLoadingFollowUp(false);
    }
  };

  const handleAnswerQuestion = (symptomKey, answerBool) => {
    setAnsweredQuestions(prev => [...prev, symptomKey]);

    if (answerBool) {
      addSymptom(symptomKey);
    } else {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'user',
          text: `No, I do not have ${symptomKey.replace(/_/g, ' ')}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    setFollowUpQuestions(prev => prev.filter(q => q.symptom_key !== symptomKey));
  };

  // Voice Speech Recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Voice transcript:", transcript);

      // Match transcript to symptom keys
      COMMON_SYMPTOMS_LIST.forEach(s => {
        if (transcript.includes(s.label.toLowerCase()) || transcript.includes(s.key.replace(/_/g, ' '))) {
          addSymptom(s.key);
        }
      });

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'user',
          text: `🎤 Voice input: "${transcript}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    recognition.start();
  };

  const handleFinalSubmit = () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom to analyze.");
      return;
    }
    onSubmitSymptoms(selectedSymptoms);
  };

  const filteredSymptoms = COMMON_SYMPTOMS_LIST.filter(s =>
    s.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.key.includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white">Interactive Symptom Questionnaire</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Answer dynamic AI questions or pick from the symptom library</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoiceInput}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              isListening 
                ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' 
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
            <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
          </button>

          <button
            onClick={handleFinalSubmit}
            disabled={selectedSymptoms.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span>Analyze Triage ({selectedSymptoms.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Chatbot Thread (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md min-h-[500px] shadow-xl relative">
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>Assessment Progress</span>
              <span>{Math.min(selectedSymptoms.length * 25, 100)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500" 
                style={{ width: `${Math.min(selectedSymptoms.length * 25, 100)}%` }}
              />
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[420px]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800/60 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                <div className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  
                  {/* Dynamic Question Interactive Buttons */}
                  {msg.isQuestion && (
                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-700/60">
                      <button
                        onClick={() => handleAnswerQuestion(msg.symptom_key, true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 text-xs transition"
                      >
                        Yes, I have this
                      </button>
                      <button
                        onClick={() => handleAnswerQuestion(msg.symptom_key, false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-600 text-xs transition"
                      >
                        No
                      </button>
                    </div>
                  )}

                  <span className="block text-[10px] text-slate-400/80 mt-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center text-xs text-cyan-400 animate-pulse">
                <Bot className="w-4 h-4" />
                <span>AI is formulating follow-up question...</span>
              </div>
            )}
          </div>

          {/* Active Selected Symptom Pills */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Reported Symptoms ({selectedSymptoms.length}):</h4>
            {selectedSymptoms.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No symptoms selected yet. Select from the right palette or answer AI questions above.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(sym => (
                  <span
                    key={sym}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-medium"
                  >
                    <span>{sym.replace(/_/g, ' ').toUpperCase()}</span>
                    <button
                      onClick={() => removeSymptom(sym)}
                      className="hover:text-red-400 transition p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Searchable Symptom Palette (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Symptom Library Palette</span>
            </h3>

            {/* Filter Input */}
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search symptoms (e.g. fever, cough, pain)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 mb-4"
            />

            {/* Scrollable Chips */}
            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {filteredSymptoms.map(s => {
                const isSelected = selectedSymptoms.includes(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() => isSelected ? removeSymptom(s.key) : addSymptom(s.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-medium transition ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Submit CTA */}
          <button
            onClick={handleFinalSubmit}
            disabled={selectedSymptoms.length === 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 disabled:opacity-40 transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Triage Results</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </div>
  );
}
