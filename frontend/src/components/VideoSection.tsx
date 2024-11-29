import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface VideoSectionProps {
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ isListening, setIsListening }) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const webcamRef = useRef<Webcam>(null);

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-xl p-6">
      <div className="flex-grow relative rounded-lg overflow-hidden mb-6 bg-gray-900">
        {isVideoEnabled ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            className="absolute inset-0 w-full h-full object-cover"
            mirrored={true}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <VideoOff className="w-20 h-20 text-gray-600" />
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-6">
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors shadow-lg`}
        >
          {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>
        
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${
            isListening ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors shadow-lg`}
        >
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};