import { OCRModelMetrics } from './types';

export const MODEL_DEFINITIONS = [
  {
    id: 'deepseek-ocr',
    name: 'DeepSeek-OCR',
    version: 'v2.1-preview',
    provider: 'DeepSeek AI',
    color: '#38bdf8', // Sky Blue
    baseLatency: 120,
    baseCpu: 45,
    baseGpu: 1024,
    accuracyBase: 98
  },
  {
    id: 'monkey-ocr',
    name: 'MonkeyOCR',
    version: 'v1.5',
    provider: 'MonkeyLab',
    color: '#f472b6', // Pink
    baseLatency: 45, // Very fast
    baseCpu: 25,
    baseGpu: 512,
    accuracyBase: 92
  },
  {
    id: 'mineru',
    name: 'MinerU',
    version: '2.5',
    provider: 'OpenDataLab',
    color: '#a78bfa', // Purple
    baseLatency: 180,
    baseCpu: 60,
    baseGpu: 2048, // Heavy
    accuracyBase: 96
  },
  {
    id: 'paddle-ocr',
    name: 'PaddleOCR-vL',
    version: 'v4-lite',
    provider: 'PaddlePaddle',
    color: '#4ade80', // Green
    baseLatency: 95,
    baseCpu: 30,
    baseGpu: 800,
    accuracyBase: 94
  }
];

// Helper to simulate text variations based on model "quirks"
export const simulateTextVariation = (originalText: string, modelId: string): string => {
  if (modelId === 'deepseek-ocr') return originalText; // Best model gets it right

  let modified = originalText;

  if (modelId === 'monkey-ocr') {
    // Fast but misses punctuation sometimes
    modified = modified.replace(/[,.;:]/g, (match) => Math.random() > 0.7 ? '' : match);
  }

  if (modelId === 'paddle-ocr') {
    // Sometimes adds extra spaces
    modified = modified.split(' ').join('  ');
  }

  if (modelId === 'mineru') {
    // Very structured, maybe overly aggressive line breaks
    modified = modified.replace(/\. /g, '.\n');
  }

  return modified;
};

export const generateMetrics = (baseText: string): OCRModelMetrics[] => {
  return MODEL_DEFINITIONS.map(def => {
    // Add randomness to metrics to make it look like a real live test
    const latencyVariance = (Math.random() * 40) - 20;
    const cpuVariance = (Math.random() * 10) - 5;
    const gpuVariance = (Math.random() * 100) - 50;
    const accuracyVariance = (Math.random() * 2) - 1;

    return {
      id: def.id,
      name: def.name,
      version: def.version,
      provider: def.provider,
      color: def.color,
      latencyMs: Math.max(10, Math.round(def.baseLatency + latencyVariance)),
      cpuUsagePercent: Math.max(0, Math.min(100, Math.round(def.baseCpu + cpuVariance))),
      gpuMemUsageMB: Math.max(0, Math.round(def.baseGpu + gpuVariance)),
      accuracyScore: Math.min(100, Number((def.accuracyBase + accuracyVariance).toFixed(1))),
      extractedText: simulateTextVariation(baseText, def.id)
    };
  });
};