import React from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  audioLevel: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, audioLevel }) => {
  const bars = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center space-x-1 h-16 mb-4">
      {bars.map((bar) => {
        const height = isActive 
          ? Math.max(8, audioLevel * 60 + Math.random() * 20) 
          : 8;
        
        return (
          <div
            key={bar}
            className={`w-2 bg-gradient-to-t transition-all duration-150 rounded-full ${
              isActive 
                ? 'from-blue-400 to-purple-400' 
                : 'from-gray-600 to-gray-500'
            }`}
            style={{
              height: `${height}px`,
              transformOrigin: 'bottom',
              transform: isActive ? 'scaleY(1)' : 'scaleY(0.3)',
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioVisualizer;