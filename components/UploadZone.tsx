import React, { useCallback } from 'react';
import { UploadCloud, FileImage } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isProcessing) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect, isProcessing]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative group w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
        ${isProcessing 
          ? 'border-slate-700 bg-slate-900/50 cursor-wait opacity-50' 
          : 'border-slate-600 bg-slate-800/30 hover:border-indigo-500 hover:bg-slate-800/80'
        }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50 disabled:cursor-wait"
      />
      
      <div className="z-10 flex flex-col items-center space-y-4 text-center px-4 pointer-events-none">
        <div className={`p-4 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 transition-colors duration-300`}>
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          ) : (
            <UploadCloud className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" />
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
            {isProcessing ? 'Processing Image...' : 'Click or drop your image here'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Supports PNG, JPG, WEBP. Benchmarking starts automatically.
          </p>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default UploadZone;