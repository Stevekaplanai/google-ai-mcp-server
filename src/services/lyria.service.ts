/**
 * Lyria 2 Music Generation Service
 * 
 * CURRENT STATUS (July 2025):
 * - Lyria 2 API is NOT publicly available through Google Cloud or AI Studio
 * - This service operates in MOCK MODE only
 * - Real API integration will be added when Google releases Lyria API
 * 
 * WHERE LYRIA 2 EXISTS:
 * - MusicFX (AI Test Kitchen): https://aitestkitchen.withgoogle.com/tools/music-fx
 * - YouTube Dream Track (select creators only)
 * - Google Labs experiments
 * 
 * ALTERNATIVES FOR PRODUCTION USE:
 * - MusicGen (Meta) via Replicate
 * - Stable Audio (Stability AI)
 * - AudioLDM2 via Hugging Face
 * 
 * This implementation is ready for when Google releases the Lyria API.
 * Expected model name patterns: musicgeneration@001, lyria@001, or similar
 */

import { GoogleAuth } from 'google-auth-library';
import { BaseGoogleService } from './base.service.js';
import type { 
  LyriaGenerateRequest, 
  LyriaGenerateResponse, 
  LyriaConfig,
  AudioFormat,
  MusicalStructure,
  Tempo 
} from '../types/lyria.types.js';

export class LyriaService extends BaseGoogleService {
  private readonly projectId: string;
  private readonly location: string;
  private readonly auth: GoogleAuth | null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;
  
  constructor(config: LyriaConfig) {
    super(config.apiKey || '', config);
    this.projectId = config.projectId || process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = config.location || process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    // Initialize auth if we have credentials
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (credentials && !this.mockMode) {
      try {
        let parsedCredentials = JSON.parse(credentials);
        if (parsedCredentials.private_key) {
          parsedCredentials.private_key = parsedCredentials.private_key.replace(/\\n/g, '\n');
        }
        this.auth = new GoogleAuth({
          credentials: parsedCredentials,
          scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
      } catch (error) {
        console.error('Failed to parse credentials:', error);
        this.auth = null;
      }
    } else {
      this.auth = null;
    }
  }

  async generateMusic(request: LyriaGenerateRequest): Promise<LyriaGenerateResponse> {
    this.validateRequest(request);
    
    if (this.mockMode) {
      return this.generateMockResponse(request);
    }
    
    try {
      return await this.executeWithRetry(() => this.callLyriaAPI(request));
    } catch (error) {
      this.log('Failed to generate music', { error: (error as Error).message });
      throw error;
    }
  }

  private validateRequest(request: LyriaGenerateRequest): void {
    if (!request.textPrompt || request.textPrompt.trim().length === 0) {
      throw new Error('Text prompt is required');
    }
    
    if (request.durationSeconds) {
      if (request.durationSeconds < 1 || request.durationSeconds > 60) {
        throw new Error('Duration must be between 1 and 60 seconds');
      }
    }
    
    const validStructures: MusicalStructure[] = ['verse-chorus', 'free-form', 'instrumental'];
    if (request.musicalStructure && !validStructures.includes(request.musicalStructure)) {
      throw new Error(`Invalid musical structure. Must be one of: ${validStructures.join(', ')}`);
    }
    
    const validTempos: Tempo[] = ['slow', 'medium', 'fast'];
    if (request.tempo && !validTempos.includes(request.tempo)) {
      throw new Error(`Invalid tempo. Must be one of: ${validTempos.join(', ')}`);
    }
  }

  private async callLyriaAPI(request: LyriaGenerateRequest): Promise<LyriaGenerateResponse> {
    const accessToken = await this.getAccessToken();
    
    // Construct the request payload
    // This is speculative - actual format will be determined when API is released
    const payload = {
      instances: [{
        prompt: request.textPrompt,
        ...(request.genre && { genre: request.genre }),
        ...(request.mood && { mood: request.mood }),
      }],
      parameters: {
        sampleCount: 1,
        durationSeconds: request.durationSeconds || 30,
        tempo: request.tempo || 'medium',
        musicalStructure: request.musicalStructure || 'free-form',
        ...(request.outputStorageUri && { outputStorageUri: request.outputStorageUri }),
      }
    };

    // Construct the endpoint
    // Model name will need to be updated when Lyria API is released
    const modelName = 'musicgeneration@001'; // Speculative - actual name TBD
    const endpoint = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${modelName}:predict`;

    this.log('Calling Lyria API', { endpoint, sampleCount: 1 });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.log('Lyria API error', { status: response.status, statusText: response.statusText, response: errorText });
      throw new Error(`Lyria generation failed: ${errorText}`);
    }

    const result = await response.json();
    return this.processApiResponse(result, request, modelName);
  }

  private processApiResponse(result: any, request: LyriaGenerateRequest, modelName: string): LyriaGenerateResponse {
    // Process the response based on expected format
    // This is speculative - actual format will be determined when API is released
    if (result.predictions && result.predictions.length > 0) {
      const prediction = result.predictions[0];
      const operationId = result.operationName || `lyria-${Date.now()}`;
      
      return {
        operationName: operationId,
        status: 'SUCCEEDED',
        metadata: {
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          target: 'lyria-music-generation',
          verb: 'generate',
        },
        done: true,
        response: {
          audio: {
            uri: prediction.audioUri || prediction.uri,
            bytesBase64Encoded: prediction.bytesBase64Encoded,
            metadata: {
              duration: request.durationSeconds || 30,
              format: 'mp3' as AudioFormat,
              sampleRate: 44100,
              bitrate: '320kbps',
              genre: request.genre,
              mood: request.mood,
              tempo: request.tempo,
              structure: request.musicalStructure,
            },
          },
          prompt: request.textPrompt,
          modelVersion: modelName,
        },
      };
    }
    
    throw new Error('Unexpected response format from Lyria API');
  }

  private generateMockResponse(request: LyriaGenerateRequest): LyriaGenerateResponse {
    const operationId = `mock-lyria-${Date.now()}`;
    
    // Generate mock base64 audio data with informative message
    const mockMessage = `
      Mock Lyria 2 Response
      Prompt: ${request.textPrompt}
      Duration: ${request.durationSeconds || 30} seconds
      
      Note: Lyria 2 API is not yet publicly available.
      This is a mock response for development purposes.
      
      To use real music generation, consider:
      - MusicFX: https://aitestkitchen.withgoogle.com/tools/music-fx
      - Alternative APIs: MusicGen (Replicate), Stable Audio
    `;
    const mockAudioData = Buffer.from(mockMessage).toString('base64');
    
    return {
      operationName: `projects/${this.projectId}/locations/${this.location}/operations/${operationId}`,
      status: 'SUCCEEDED',
      metadata: {
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        target: 'lyria-music-generation',
        verb: 'generate',
      },
      done: true,
      response: {
        audio: {
          uri: `gs://mock-bucket/lyria-output/${operationId}/audio.mp3`,
          bytesBase64Encoded: mockAudioData,
          metadata: {
            duration: request.durationSeconds || 30,
            format: 'mp3' as AudioFormat,
            sampleRate: 44100,
            bitrate: '320kbps',
            genre: request.genre,
            mood: request.mood,
            tempo: request.tempo,
            structure: request.musicalStructure,
          },
        },
        prompt: request.textPrompt,
        modelVersion: 'mock-lyria-v2',
      },
    };
  }

  async getOperationStatus(operationName: string): Promise<LyriaGenerateResponse> {
    if (this.mockMode || operationName.includes('mock')) {
      // Return a completed mock operation
      return {
        operationName,
        status: 'SUCCEEDED',
        metadata: {
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          target: 'lyria-music-generation',
          verb: 'generate',
        },
        done: true,
        response: {
          audio: {
            uri: `gs://mock-bucket/lyria-output/completed/audio.mp3`,
            metadata: {
              duration: 30,
              format: 'mp3' as AudioFormat,
              sampleRate: 44100,
              bitrate: '320kbps',
            },
          },
          prompt: 'Mock completed operation',
          modelVersion: 'mock-lyria-v2',
        },
      };
    }

    const accessToken = await this.getAccessToken();
    const endpoint = `https://${this.location}-aiplatform.googleapis.com/v1/${operationName}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get operation status: ${response.statusText}`);
    }

    const result = await response.json();
    return result as LyriaGenerateResponse;
  }

  // Helper methods
  private async getAccessToken(): Promise<string> {
    if (!this.auth) {
      throw new Error('No authentication configured for Lyria service');
    }
    
    const token = await this.auth.getAccessToken();
    if (!token) {
      throw new Error('Failed to get access token');
    }
    
    return token;
  }

  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.log(`Attempt ${attempt} failed:`, error);
        
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * attempt);
        }
      }
    }
    
    throw lastError || new Error('Operation failed after retries');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
