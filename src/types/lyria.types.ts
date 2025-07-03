export interface LyriaConfig {
  projectId?: string;
  location?: string;
  apiKey?: string;
  mockMode?: boolean;
  debug?: boolean;
  useMock?: boolean;
}

export type Tempo = 'slow' | 'medium' | 'fast';
export type MusicalStructure = 'verse-chorus' | 'free-form' | 'instrumental';
export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'flac';

export interface LyriaGenerateRequest {
  textPrompt: string;
  durationSeconds?: number; // 1-60 seconds
  genre?: string;
  mood?: string;
  tempo?: Tempo;
  musicalStructure?: MusicalStructure;
  outputStorageUri?: string;
}

export interface AudioMetadata {
  duration: number;
  format: AudioFormat;
  sampleRate: number;
  bitrate: string;
  genre?: string;
  mood?: string;
  tempo?: Tempo;
  structure?: MusicalStructure;
}

export interface AudioOutput {
  uri?: string;
  bytesBase64Encoded?: string;
  metadata: AudioMetadata;
}

export interface LyriaResponse {
  audio: AudioOutput;
  prompt: string;
  modelVersion: string;
}

export interface LyriaGenerateResponse {
  operationName: string;
  status: 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
  metadata: {
    createTime: string;
    updateTime?: string;
    target: string;
    verb: string;
  };
  done: boolean;
  response?: LyriaResponse;
  error?: {
    code: number;
    message: string;
    details?: any[];
  };
}

// Tool parameter types for MCP
export interface LyriaToolParams {
  textPrompt: string;
  durationSeconds?: number;
  genre?: string;
  mood?: string;
  tempo?: string;
  musicalStructure?: string;
  outputStorageUri?: string;
}

export interface CheckOperationParams {
  operationName: string;
}
