import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Github
} from 'lucide-react';
import UploadZone from './components/UploadZone';
import MetricCard from './components/MetricCard';
import { LatencyChart, ResourceChart, AccuracyRadarChart } from './components/Charts';
import TextComparison from './components/TextComparison';
import { OCRModelMetrics, UploadedFileState, ViewMode } from './types';
import { generateMetrics } from './constants';
import { extractTextFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [fileState, setFileState] = useState<UploadedFileState>({ file: null, previewUrl: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<OCRModelMetrics[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (file: File) => {
    const url = URL.createObjectURL(file);
    setFileState({ file, previewUrl: url });
    setResults([]); // Clear previous results
    setIsProcessing(true);

    try {
      // 1. Convert file to Base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      
      // Remove data URL prefix for API call
      const base64Data = base64.split(',')[1];
      const mimeType = file.type;

      // 2. Get Ground Truth from Gemini
      const extractedText = await extractTextFromImage(base64Data, mimeType);

      // 3. Generate metrics for comparison models based on the text
      // We add a slight artificial delay to simulate heavy model loading
      setTimeout(() => {
        const simulatedResults = generateMetrics(extractedText);
        setResults(simulatedResults);
        setIsProcessing(false);
        
        // Auto scroll to results
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 1500);

    } catch (error) {
      console.error("Processing failed", error);
      setIsProcessing(false);
      alert("Failed to process image. Please check console.");
    }
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (fileState.previewUrl) {
        URL.revokeObjectURL(fileState.previewUrl);
      }
    };
  }, [fileState.previewUrl]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[#0f172a]/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                OCREval Pro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Docs</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Models</a>
              <a 
                href="https://github.com/google-gemini/ocr-eval-pro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            The Ultimate <span className="text-indigo-400">OCR Benchmark</span> Suite
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Compare DeepSeek, MonkeyOCR, MinerU, and PaddleOCR with real-time performance metrics. 
            Analyze latency, memory usage, and extraction accuracy in one unified dashboard.
          </p>
        </section>

        {/* Upload Section */}
        <section className="max-w-3xl mx-auto">
            <div className="bg-slate-800/30 p-1 rounded-3xl border border-slate-700/50 shadow-2xl">
                <UploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            </div>
        </section>

        {/* Results Section */}
        {(results.length > 0 || fileState.previewUrl) && (
          <div ref={resultsRef} className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold flex items-center space-x-2">
                 <BarChart3 className="w-6 h-6 text-indigo-400" />
                 <span>Benchmark Results</span>
               </h2>
               <div className="flex bg-slate-800 rounded-lg p-1 space-x-1 border border-slate-700">
                  {[
                      { mode: ViewMode.SPLIT, icon: LayoutDashboard, label: 'Split' },
                      { mode: ViewMode.CHARTS, icon: BarChart3, label: 'Charts' },
                      { mode: ViewMode.TEXT, icon: FileText, label: 'Text' },
                  ].map((item) => (
                      <button
                        key={item.mode}
                        onClick={() => setViewMode(item.mode)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                            ${viewMode === item.mode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                          <item.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{item.label}</span>
                      </button>
                  ))}
               </div>
            </div>

            {/* Top Level Metrics Summary (Best Performer) */}
            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <MetricCard 
                        label="Lowest Latency" 
                        value={Math.min(...results.map(r => r.latencyMs))} 
                        unit="ms"
                        icon="latency"
                        color="#f472b6" // Monkey
                     />
                     <MetricCard 
                        label="Highest Accuracy" 
                        value={Math.max(...results.map(r => r.accuracyScore))} 
                        unit="%"
                        icon="accuracy"
                        color="#38bdf8" // DeepSeek
                     />
                     <MetricCard 
                        label="Peak GPU Mem" 
                        value={Math.max(...results.map(r => r.gpuMemUsageMB))} 
                        unit="MB"
                        icon="gpu"
                        color="#a78bfa" // MinerU
                     />
                     <MetricCard 
                        label="Avg CPU Load" 
                        value={Math.round(results.reduce((acc, curr) => acc + curr.cpuUsagePercent, 0) / results.length)} 
                        unit="%"
                        icon="cpu"
                        color="#4ade80"
                     />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Image & Radar */}
                <div className={`space-y-6 ${viewMode === ViewMode.TEXT ? 'hidden' : viewMode === ViewMode.CHARTS ? 'lg:col-span-4' : 'lg:col-span-5'}`}>
                    {/* Image Preview */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Input Source</h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/50 flex items-center justify-center">
                            {fileState.previewUrl ? (
                                <img src={fileState.previewUrl} alt="Preview" className="object-contain max-h-full max-w-full" />
                            ) : (
                                <span className="text-slate-600 text-sm">No image loaded</span>
                            )}
                        </div>
                    </div>

                    {/* Radar Chart */}
                    {results.length > 0 && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                             <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Accuracy Distribution</h3>
                             <AccuracyRadarChart data={results} />
                        </div>
                    )}
                </div>

                {/* Middle/Right Column: Charts or Text */}
                <div className={`space-y-6 ${viewMode === ViewMode.TEXT ? 'lg:col-span-12' : viewMode === ViewMode.CHARTS ? 'lg:col-span-8' : 'lg:col-span-7'}`}>
                    
                    {/* Performance Charts */}
                    {(viewMode === ViewMode.CHARTS || viewMode === ViewMode.SPLIT) && results.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Inference Latency</h3>
                                        <p className="text-sm text-slate-500">Time to first token / complete extraction</p>
                                    </div>
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                </div>
                                <LatencyChart data={results} />
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Resource Utilization</h3>
                                        <p className="text-sm text-slate-500">Peak CPU and VRAM consumption during inference</p>
                                    </div>
                                    <Cpu className="w-5 h-5 text-blue-500" />
                                </div>
                                <ResourceChart data={results} />
                            </div>
                        </div>
                    )}
                    
                    {/* Text Comparison Tool */}
                    {(viewMode === ViewMode.TEXT || viewMode === ViewMode.SPLIT) && results.length > 0 && (
                         <div className="h-[600px]">
                             <TextComparison results={results} />
                         </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] mt-20 py-12">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
                Powered by Gemini 2.5 Flash for benchmark ground truth generation.
            </p>
            <p className="text-slate-600 text-xs mt-2">
                Note: This is a simulation dashboard. Actual OCR inference for DeepSeek/Paddle occurs on mocked backend data for this demo.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default App;