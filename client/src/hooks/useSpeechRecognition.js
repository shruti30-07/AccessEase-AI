import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognitionAPI = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export function useSpeechRecognition() {
  const [isSupported] = useState(!!SpeechRecognitionAPI);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognitionAPI) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) setTranscript(prev => prev + final + ' ');
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setInterimTranscript('');
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try speaking again.');
      } else {
        setError('Speech recognition error: ' + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    return () => { recognition.abort(); };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      setError('Could not start microphone. Please try again.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return { isSupported, isListening, transcript, interimTranscript, error, startListening, stopListening, clearTranscript, setTranscript };
}
