export interface OCRModelMetrics {
  id: string;
  name: string;
  version: string;
  provider: string;
  latencyMs: number;
  cpuUsagePercent: number;
  gpuMemUsageMB: number;
  accuracyScore: number; // 0-100
  extractedText: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: number | string;
}

export enum ViewMode {
  CHARTS = 'CHARTS',
  TEXT = 'TEXT',
  SPLIT = 'SPLIT'
}

export interface UploadedFileState {
  file: File | null;
  previewUrl: string | null;
}