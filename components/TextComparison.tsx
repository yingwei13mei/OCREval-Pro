import React, { useState } from 'react';
import { Copy, Check, Terminal, Maximize2 } from 'lucide-react';
import { OCRModelMetrics } from '../types';

interface TextComparisonProps {
  results: OCRModelMetrics[];
}

const TextComparison: React.FC<TextComparisonProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<string>(results[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const activeResult = results.find(r => r.id === activeTab) || results[0];

  if (!activeResult) return null;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-700">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar">
          {results.map((model) => (
            <button
              key={model.id}
              onClick={() => setActiveTab(model.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center space-x-2
                ${activeTab === model.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }}></span>
              <span>{model.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
            <span>CHARS: {activeResult.extractedText.length}</span>
            <span className="hidden sm:inline">LATENCY: {activeResult.latencyMs}ms</span>
            <span className="hidden sm:inline">CONFIDENCE: {activeResult.accuracyScore}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleCopy(activeResult.extractedText, activeResult.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md text-xs font-medium transition-colors"
          >
            {copiedId === activeResult.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative group">
        <textarea
          readOnly
          value={activeResult.extractedText}
          className="w-full h-full p-4 bg-[#0B1120] text-slate-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Terminal className="w-5 h-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default TextComparison;