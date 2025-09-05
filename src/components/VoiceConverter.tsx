import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Download, Trash2, Settings, Sparkles } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import WorkflowDisplay from './WorkflowDisplay';
import { processVoiceCommand } from '../utils/voiceProcessor';
import { WorkflowNode } from '../types/workflow';

interface VoiceSession {
  id: string;
  transcript: string;
  workflow: WorkflowNode[];
  timestamp: Date;
  confidence: number;
}

const VoiceConverter: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowNode[]>([]);
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceCommand(finalTranscript, event.results[event.results.length - 1][0].confidence);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [selectedLanguage]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      source.connect(analyserRef.current);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
      
      setIsRecording(true);
      setTranscript('');
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setAudioLevel(0);
    recognitionRef.current?.stop();
    
    // Stop all media tracks to fully release microphone
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleVoiceCommand = async (command: string, confidence: number) => {
    setIsProcessing(true);
    
    try {
      const workflow = await processVoiceCommand(command);
      setCurrentWorkflow(workflow);
      
      const newSession: VoiceSession = {
        id: Date.now().toString(),
        transcript: command,
        workflow,
        timestamp: new Date(),
        confidence
      };
      
      setSessions(prev => [newSession, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error processing voice command:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportWorkflow = () => {
    if (currentWorkflow.length === 0) return;
    
    const workflowData = {
      nodes: currentWorkflow,
      metadata: {
        created: new Date().toISOString(),
        source: 'voice-command',
        transcript: transcript
      }
    };
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comfyui-workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearSession = () => {
    setTranscript('');
    setCurrentWorkflow([]);
    setSessions([]);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Voice-to-ComfyUI Converter
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your voice commands into powerful ComfyUI workflows using advanced AI processing
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Voice Input Section */}
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </h3>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="ru-RU">Russian (Русский)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="ko-KR">Korean</option>
                  <option value="zh-CN">Chinese (Mandarin)</option>
                </select>
              </div>
            </div>

            {/* Voice Recording Interface */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="text-center">
                <div className="relative mb-6">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                        : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-10 h-10 text-white" />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                  </button>
                  
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                  )}
                </div>
                
                <AudioVisualizer isActive={isRecording} audioLevel={audioLevel} />
                
                <p className="text-gray-300 mb-2">
                  {isRecording ? 'Listening...' : 'Click to start voice recognition'}
                </p>
                
                {isRecording && (
                  <p className="text-sm text-yellow-400 mb-2">
                    Click the microphone button again or use "Stop Recording" to stop
                  </p>
                )}
                
                {isProcessing && (
                  <div className="flex items-center justify-center text-blue-400">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
                    Processing command...
                  </div>
                )}
              </div>
              
              {/* Current Transcript */}
              {transcript && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Current Command:</h4>
                  <p className="text-white">{transcript}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              {currentWorkflow.length > 0 && (
                <div className="flex gap-3 mt-6 justify-center">
                  <button
                    onClick={exportWorkflow}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                  <button
                    onClick={clearSession}
                    className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                  {isRecording && (
                    <button
                      onClick={stopRecording}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Recording
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Sessions</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                      onClick={() => {
                        setTranscript(session.transcript);
                        setCurrentWorkflow(session.workflow);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          {session.timestamp.toLocaleTimeString()}
                        </span>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            session.confidence > 0.8 ? 'bg-green-400' : 
                            session.confidence > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-xs text-gray-400">
                            {Math.round(session.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-white text-sm line-clamp-2">{session.transcript}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {session.workflow.length} nodes generated
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Workflow Display Section */}
          <div className="space-y-6">
            <WorkflowDisplay workflow={currentWorkflow} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceConverter;