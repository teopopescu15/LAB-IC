"use client";
import { useState, useRef } from "react";

interface GeminiVoiceSearchProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function GeminiVoiceSearch({
  onTranscript,
  disabled,
}: GeminiVoiceSearchProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudioToGemini(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Nu se poate accesa microfonul");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const sendAudioToGemini = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.webm");

      const response = await fetch("/api/pets/voice-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process audio");
      }

      const data = await response.json();
      if (data.transcript) {
        onTranscript(data.transcript);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Eroare la procesarea audio-ului");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isProcessing}
        className={`p-3 rounded-full transition-all duration-200 ${
          isRecording
            ? "bg-red-500 text-white animate-pulse shadow-lg"
            : isProcessing
            ? "bg-yellow-500 text-white"
            : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
      >
        {isProcessing ? "⏳" : isRecording ? "⏹️" : "🎤"}
      </button>
      {isRecording && (
        <span className="text-sm text-red-600 animate-pulse font-medium">
          Înregistrez...
        </span>
      )}
      {isProcessing && (
        <span className="text-sm text-yellow-600 font-medium">
          Procesez cu AI...
        </span>
      )}
    </div>
  );
}
