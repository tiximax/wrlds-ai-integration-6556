import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Brain,
  Waveform,
  Play,
  Pause,
  RotateCcw,
  Search,
  X
} from 'lucide-react';
import { getAnalyticsTracker } from '@/utils/searchAnalytics';

interface VoiceSearchComponentProps {
  onVoiceSearch?: (transcript: string, confidence: number) => void;
  onTranscriptChange?: (transcript: string, isInterim: boolean) => void;
  isEnabled?: boolean;
  className?: string;
}

interface VoiceSearchState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  hasPermission: boolean;
  isSupported: boolean;
  audioLevel: number;
}

interface AISearchSuggestion {
  intent: string;
  confidence: number;
  suggested_query: string;
  refinements: string[];
  semantic_understanding: {
    entities: string[];
    categories: string[];
    intent_type: 'product_search' | 'comparison' | 'recommendation' | 'question';
  };
}

const VoiceSearchComponent: React.FC<VoiceSearchComponentProps> = ({
  onVoiceSearch,
  onTranscriptChange,
  isEnabled = true,
  className = ''
}) => {
  const [state, setState] = useState<VoiceSearchState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null,
    hasPermission: false,
    isSupported: false,
    audioLevel: 0
  });

  const [aiSuggestion, setAISuggestion] = useState<AISearchSuggestion | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en-US',
    continuous: true,
    interimResults: true,
    maxResults: 5
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setState(prev => ({ ...prev, isSupported: true }));
      
      const recognition = new SpeechRecognition();
      recognition.continuous = voiceSettings.continuous;
      recognition.interimResults = voiceSettings.interimResults;
      recognition.lang = voiceSettings.language;
      recognition.maxAlternatives = voiceSettings.maxResults;

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null }));
        startAudioLevelMonitoring();
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const confidence = event.results[event.results.length - 1]?.[0]?.confidence || 0;

        setState(prev => ({
          ...prev,
          transcript: finalTranscript.trim(),
          interimTranscript: interimTranscript.trim(),
          confidence
        }));

        if (onTranscriptChange) {
          onTranscriptChange(finalTranscript.trim() || interimTranscript.trim(), !finalTranscript);
        }

        if (finalTranscript.trim()) {
          processVoiceSearch(finalTranscript.trim(), confidence);
        }
      };

      recognition.onerror = (event) => {
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Try speaking louder.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied.';
            break;
          case 'network':
            errorMessage = 'Network error occurred.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }

        setState(prev => ({ 
          ...prev, 
          isListening: false, 
          isProcessing: false,
          error: errorMessage 
        }));
        stopAudioLevelMonitoring();
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false, isProcessing: false }));
        stopAudioLevelMonitoring();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopAudioLevelMonitoring();
    };
  }, [voiceSettings, onTranscriptChange]);

  // Request microphone permission
  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setState(prev => ({ ...prev, hasPermission: true, error: null }));
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        hasPermission: false, 
        error: 'Microphone permission required for voice search' 
      }));
      return false;
    }
  }, []);

  // Start audio level monitoring
  const startAudioLevelMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedLevel = Math.min(average / 50, 1);
        
        setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error starting audio monitoring:', error);
    }
  }, []);

  // Stop audio level monitoring
  const stopAudioLevelMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setState(prev => ({ ...prev, audioLevel: 0 }));
  }, []);

  // Process voice search with AI understanding
  const processVoiceSearch = useCallback(async (transcript: string, confidence: number) => {
    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Track voice search analytics
      const tracker = getAnalyticsTracker();
      tracker.trackVoiceSearch(transcript, confidence, performance.now());

      // Simulate AI processing for semantic understanding
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiSuggestion: AISearchSuggestion = await processWithAI(transcript);
      setAISuggestion(aiSuggestion);

      if (onVoiceSearch) {
        onVoiceSearch(aiSuggestion.suggested_query, confidence);
      }

    } catch (error) {
      console.error('Error processing voice search:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to process voice search. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [onVoiceSearch]);

  // Simulate AI processing (in real app, this would call your AI service)
  const processWithAI = useCallback(async (transcript: string): Promise<AISearchSuggestion> => {
    // Mock AI processing
    const entities = extractEntities(transcript);
    const categories = inferCategories(transcript);
    const intentType = classifyIntent(transcript);
    
    return {
      intent: `Search for ${entities.join(', ')}`,
      confidence: 0.85,
      suggested_query: transcript.toLowerCase().replace(/[^\w\s]/g, '').trim(),
      refinements: generateRefinements(transcript, entities, categories),
      semantic_understanding: {
        entities,
        categories,
        intent_type: intentType
      }
    };
  }, []);

  // Extract entities from transcript (mock implementation)
  const extractEntities = (transcript: string): string[] => {
    const commonProducts = ['laptop', 'phone', 'headphones', 'camera', 'tablet', 'watch', 'speaker'];
    const brands = ['apple', 'samsung', 'sony', 'nike', 'adidas', 'canon', 'dell'];
    const colors = ['black', 'white', 'blue', 'red', 'silver', 'gold'];
    
    const entities: string[] = [];
    const lowerTranscript = transcript.toLowerCase();
    
    [...commonProducts, ...brands, ...colors].forEach(term => {
      if (lowerTranscript.includes(term)) {
        entities.push(term);
      }
    });
    
    return entities;
  };

  // Infer categories from transcript
  const inferCategories = (transcript: string): string[] => {
    const categoryMapping: Record<string, string[]> = {
      'Electronics': ['laptop', 'phone', 'computer', 'tablet', 'camera', 'headphones'],
      'Clothing': ['shirt', 'shoes', 'jacket', 'dress', 'pants'],
      'Sports': ['running', 'fitness', 'gym', 'sports', 'athletic'],
      'Home': ['furniture', 'kitchen', 'bedroom', 'living room']
    };
    
    const lowerTranscript = transcript.toLowerCase();
    const categories: string[] = [];
    
    Object.entries(categoryMapping).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
        categories.push(category);
      }
    });
    
    return categories.length > 0 ? categories : ['General'];
  };

  // Classify search intent
  const classifyIntent = (transcript: string): 'product_search' | 'comparison' | 'recommendation' | 'question' => {
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('compare') || lowerTranscript.includes('vs')) {
      return 'comparison';
    }
    if (lowerTranscript.includes('recommend') || lowerTranscript.includes('best') || lowerTranscript.includes('suggest')) {
      return 'recommendation';
    }
    if (lowerTranscript.includes('?') || lowerTranscript.startsWith('how') || lowerTranscript.startsWith('what')) {
      return 'question';
    }
    
    return 'product_search';
  };

  // Generate search refinements
  const generateRefinements = (transcript: string, entities: string[], categories: string[]): string[] => {
    const refinements: string[] = [];
    
    if (entities.length > 0) {
      refinements.push(`${entities.join(' ')} deals`);
      refinements.push(`${entities.join(' ')} reviews`);
    }
    
    if (categories.length > 0) {
      refinements.push(`popular ${categories[0].toLowerCase()} items`);
    }
    
    refinements.push(`${transcript} on sale`);
    refinements.push(`${transcript} best price`);
    
    return refinements.slice(0, 3);
  };

  // Toggle voice search
  const toggleVoiceSearch = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Voice search not supported in this browser' }));
      return;
    }

    if (!state.hasPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    if (state.isListening) {
      recognitionRef.current?.stop();
    } else {
      setState(prev => ({ 
        ...prev, 
        transcript: '', 
        interimTranscript: '', 
        error: null,
        confidence: 0
      }));
      setAISuggestion(null);
      recognitionRef.current?.start();
    }
  }, [state.isSupported, state.hasPermission, state.isListening, requestMicrophonePermission]);

  // Clear results
  const clearResults = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      transcript: '', 
      interimTranscript: '', 
      error: null,
      confidence: 0
    }));
    setAISuggestion(null);
    if (state.isListening) {
      recognitionRef.current?.stop();
    }
  }, [state.isListening]);

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Voice Search</h3>
            <p className="text-sm text-gray-500">Speak naturally to search for products</p>
          </div>
        </div>

        <button
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Brain className="h-5 w-5" />
        </button>
      </div>

      {/* Voice Search Interface */}
      <div className="space-y-6">
        {/* Main Voice Button */}
        <div className="flex flex-col items-center space-y-4">
          <motion.button
            onClick={toggleVoiceSearch}
            disabled={!isEnabled || !state.isSupported}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              state.isListening
                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg scale-110'
                : state.isProcessing
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileTap={{ scale: 0.95 }}
            animate={state.isListening ? { 
              scale: [1, 1.1, 1], 
              boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 20px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
            } : {}}
            transition={{ duration: 1.5, repeat: state.isListening ? Infinity : 0 }}
          >
            {state.isProcessing ? (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            ) : state.isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}

            {/* Audio Level Indicator */}
            {state.isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/30"
                animate={{ 
                  scale: 1 + state.audioLevel * 0.3,
                  opacity: 0.6 + state.audioLevel * 0.4
                }}
                transition={{ duration: 0.1 }}
              />
            )}
          </motion.button>

          {/* Status Text */}
          <div className="text-center">
            {state.isListening && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-blue-600"
              >
                Listening... Speak now
              </motion.p>
            )}
            {state.isProcessing && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-purple-600 flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Processing with AI...
              </motion.p>
            )}
            {!state.isListening && !state.isProcessing && (
              <p className="text-sm text-gray-500">
                {state.isSupported 
                  ? 'Click to start voice search' 
                  : 'Voice search not available'
                }
              </p>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        <AnimatePresence>
          {(state.transcript || state.interimTranscript) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Transcript:</p>
                  <p className="text-gray-900">
                    <span className="font-medium">{state.transcript}</span>
                    <span className="text-gray-500 italic">{state.interimTranscript}</span>
                  </p>
                  {state.confidence > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-20">
                        <motion.div
                          className="bg-green-500 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${state.confidence * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{(state.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={clearResults}
                  className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Understanding Results */}
        <AnimatePresence>
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">AI Understanding</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {(aiSuggestion.confidence * 100).toFixed(0)}% confident
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Suggested Search:</p>
                  <p className="text-blue-900 font-semibold">{aiSuggestion.suggested_query}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiSuggestion.semantic_understanding.entities.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Detected Products:</p>
                      <div className="flex flex-wrap gap-1">
                        {aiSuggestion.semantic_understanding.entities.map((entity, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiSuggestion.semantic_understanding.categories.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {aiSuggestion.semantic_understanding.categories.map((category, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {aiSuggestion.refinements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Suggested Refinements:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestion.refinements.map((refinement, idx) => (
                        <button
                          key={idx}
                          onClick={() => onVoiceSearch?.(refinement, aiSuggestion.confidence)}
                          className="text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          {refinement}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{state.error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvancedOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 pt-4"
            >
              <h5 className="text-sm font-medium text-gray-700 mb-3">Voice Settings</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                  <select
                    value={voiceSettings.language}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Results</label>
                  <select
                    value={voiceSettings.maxResults}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-3 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={voiceSettings.continuous}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, continuous: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-600">Continuous listening</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={voiceSettings.interimResults}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, interimResults: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-600">Show interim results</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VoiceSearchComponent;
