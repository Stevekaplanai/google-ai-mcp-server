#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import dotenv from 'dotenv';
import { ImagenService } from './services/imagen.service.js';
import { VeoService } from './services/veo.service.js';
import { LyriaService } from './services/lyria.service.js';

// Load environment variables
dotenv.config();

// Configuration schema
const ConfigSchema = z.object({
  projectId: z.string(),
  location: z.string().default('us-central1'),
  credentials: z.object({
    type: z.string(),
    project_id: z.string(),
    private_key_id: z.string(),
    private_key: z.string(),
    client_email: z.string(),
    client_id: z.string(),
    auth_uri: z.string(),
    token_uri: z.string(),
    auth_provider_x509_cert_url: z.string(),
    client_x509_cert_url: z.string(),
  }).optional(),
});
type Config = z.infer<typeof ConfigSchema>;

// Configuration
let config: Config;
let auth: GoogleAuth | null = null;
let imagenService: ImagenService | null = null;
let veoService: VeoService | null = null;
let lyriaService: LyriaService | null = null;
const USE_MOCK = process.env.USE_MOCK === 'true' || !process.env.GOOGLE_CLOUD_PROJECT;

// Initialize configuration
function initializeConfig() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'mock-project';
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  
  let credentials;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    } catch (error) {
      console.error('Failed to parse credentials JSON:', error);
    }
  }

  config = ConfigSchema.parse({
    projectId,
    location,
    credentials,
  });

  if (!USE_MOCK && credentials) {
    auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
  }

  // Initialize Imagen service
  imagenService = new ImagenService('', { 
    mockMode: USE_MOCK,
    debug: true
  });
  
  // Initialize VEO service
  veoService = new VeoService('', {
    mockMode: USE_MOCK,
    debug: true
  });
  
  // Initialize Lyria service
  lyriaService = new LyriaService({
    mockMode: USE_MOCK,
    debug: true
  });
}

// MCP Server setup
const server = new Server(
  {
    name: 'google-ai-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const tools = [
  {
    name: 'veo_generate_video',
    description: 'Generate videos using Google VEO 3 (5-8 seconds with audio)',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Text prompt for video generation' },
        imageBase64: { type: 'string', description: 'Base64-encoded image for image-to-video generation' },
        duration: { type: 'number', minimum: 5, maximum: 8, default: 5, description: 'Video duration in seconds' },
        aspectRatio: { enum: ['16:9', '9:16', '1:1'], default: '16:9', description: 'Video aspect ratio' },
        sampleCount: { type: 'number', minimum: 1, maximum: 4, default: 1, description: 'Number of videos to generate' },
        negativePrompt: { type: 'string', description: 'What to avoid in the generation' },
        personGeneration: { enum: ['allow', 'disallow'], default: 'allow', description: 'Whether to allow person generation' },
        outputStorageUri: { type: 'string', description: 'GCS bucket URI for output' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'imagen_generate_image',
    description: 'Generate photorealistic images using Google Imagen 4',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Text prompt for image generation' },
        sampleCount: { type: 'number', minimum: 1, maximum: 8, default: 1, description: 'Number of images to generate' },
        aspectRatio: { enum: ['1:1', '16:9', '9:16', '4:3', '3:4'], default: '1:1', description: 'Image aspect ratio' },
        negativePrompt: { type: 'string', description: 'What to avoid in the generation' },
        personGeneration: { enum: ['allow', 'disallow'], default: 'allow', description: 'Whether to allow person generation' },
        language: { type: 'string', default: 'en', description: 'Language for the prompt' },
        outputStorageUri: { type: 'string', description: 'GCS bucket URI for output' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'gemini_generate_text',
    description: 'Generate text using Google Gemini models',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Text prompt for Gemini' },
        model: { enum: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'], default: 'gemini-1.5-flash', description: 'Gemini model to use' },
        temperature: { type: 'number', minimum: 0, maximum: 2, default: 0.7, description: 'Temperature for randomness' },
        maxTokens: { type: 'number', minimum: 1, maximum: 8192, default: 2048, description: 'Maximum tokens to generate' },
        systemInstruction: { type: 'string', description: 'System instruction for the model' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'lyria_generate_music',
    description: 'Generate music using Google Lyria 2 (up to 60 seconds)',
    inputSchema: {
      type: 'object',
      properties: {
        textPrompt: { type: 'string', description: 'Text description of the music to generate' },
        musicalStructure: { enum: ['verse-chorus', 'free-form', 'instrumental'], default: 'free-form', description: 'Musical structure' },
        genre: { type: 'string', description: 'Musical genre' },
        mood: { type: 'string', description: 'Mood of the music' },
        tempo: { enum: ['slow', 'medium', 'fast'], description: 'Tempo of the music' },
        durationSeconds: { type: 'number', minimum: 1, maximum: 60, default: 30, description: 'Duration in seconds' },
        outputStorageUri: { type: 'string', description: 'GCS bucket URI for output' },
      },
      required: ['textPrompt'],
    },
  },
  {
    name: 'check_operation_status',
    description: 'Check the status of a long-running operation',
    inputSchema: {
      type: 'object',
      properties: {
        operationName: { type: 'string', description: 'Operation name from a previous request' },
      },
      required: ['operationName'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'veo_generate_video':
        return await handleVeoGenerate(args);
      case 'imagen_generate_image':
        return await handleImagenGenerate(args);
      case 'gemini_generate_text':
        return await handleGeminiGenerate(args);
      case 'lyria_generate_music':
        return await handleLyriaGenerate(args);
      case 'check_operation_status':
        return await handleCheckOperation(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
    };
  }
});

// VEO 3 Handler
async function handleVeoGenerate(args: any) {
  try {
    if (!veoService) {
      throw new Error('VEO service not initialized');
    }

    const result = await veoService.generateVideo({
      prompt: args.prompt,
      imageBase64: args.imageBase64,
      duration: args.duration,
      aspectRatio: args.aspectRatio,
      sampleCount: args.sampleCount,
      negativePrompt: args.negativePrompt,
      personGeneration: args.personGeneration,
      outputStorageUri: args.outputStorageUri
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('VEO generation error:', error);
    throw error;
  }
}

// Imagen 4 Handler
async function handleImagenGenerate(args: any) {
  try {
    if (!imagenService) {
      throw new Error('Imagen service not initialized');
    }

    const result = await imagenService.generateImage(
      args.prompt,
      args.aspectRatio,
      args.sampleCount,
      args.negativePrompt,
      args.personGeneration,
      args.language,
      args.outputStorageUri
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('Imagen generation error:', error);
    throw error;
  }
}

// Gemini Handler
async function handleGeminiGenerate(args: any) {
  if (USE_MOCK) {
    // Mock response for testing
    const mockResponses: Record<string, string> = {
      'hello': 'Hello! How can I assist you today?',
      'test': 'This is a mock response from Gemini. In production, this would be a real AI-generated response.',
      'default': `Based on your prompt "${args.prompt}", here's a mock Gemini response. When connected to the real API, Gemini will provide intelligent, contextual responses.`,
    };
    
    const response = mockResponses[args.prompt.toLowerCase()] || mockResponses.default;
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            text: response,
            model: args.model || 'gemini-1.5-flash',
            usage: {
              promptTokens: args.prompt.length,
              completionTokens: response.length,
              totalTokens: args.prompt.length + response.length,
            },
            finishReason: 'STOP',
            safety: {
              categories: [],
              blocked: false,
            },
          }, null, 2),
        },
      ],
    };
  }

  // Real Gemini API implementation
  try {
    if (!auth) {
      throw new Error('Google Cloud authentication not configured');
    }

    const token = await auth.getAccessToken();
    const model = args.model || 'gemini-1.5-flash';
    const endpoint = `https://${config.location}-aiplatform.googleapis.com/v1/projects/${config.projectId}/locations/${config.location}/publishers/google/models/${model}:generateContent`;

    const requestBody: any = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: args.prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: args.temperature || 0.7,
        maxOutputTokens: args.maxTokens || 2048,
      },
    };

    if (args.systemInstruction) {
      requestBody.systemInstruction = {
        parts: [
          {
            text: args.systemInstruction,
          },
        ],
      };
    }

    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Lyria 2 Handler
async function handleLyriaGenerate(args: any) {
  if (USE_MOCK) {
    // Mock response for testing
    const operationId = `mock-lyria-${Date.now()}`;
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            operationName: `projects/${config.projectId}/locations/${config.location}/operations/${operationId}`,
            status: 'PROCESSING',
            metadata: {
              createTime: new Date().toISOString(),
              target: 'lyria-music-generation',
              verb: 'generate',
            },
            done: false,
            response: {
              audio: {
                uri: `gs://mock-bucket/lyria-output/${operationId}/audio.mp3`,
                metadata: {
                  duration: args.durationSeconds || 30,
                  format: 'mp3',
                  sampleRate: 44100,
                  bitrate: '320kbps',
                  genre: args.genre,
                  mood: args.mood,
                  tempo: args.tempo,
                  structure: args.musicalStructure || 'free-form',
                },
              },
              prompt: args.textPrompt,
              modelVersion: 'lyria-2-latest',
            },
          }, null, 2),
        },
      ],
    };
  }

  // TODO: Implement real Lyria 2 API call when available
  // Note: Lyria 2 may have limited availability
  return {
    content: [
      {
        type: 'text',
        text: 'Lyria 2 API implementation pending. Please use mock mode (USE_MOCK=true) for testing.',
      },
    ],
  };
}

// Operation Status Handler
async function handleCheckOperation(args: any) {
  const { operationName } = args;
  
  if (USE_MOCK) {
    // Mock operation status
    const mockStatuses = ['PROCESSING', 'DONE', 'FAILED'];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
    
    const response: any = {
      name: operationName,
      metadata: {
        createTime: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        updateTime: new Date().toISOString(),
      },
      done: randomStatus === 'DONE',
    };
    
    if (randomStatus === 'DONE') {
      response.response = {
        status: 'SUCCESS',
        outputUri: `gs://mock-bucket/output/${operationName.split('/').pop()}`,
        completionTime: new Date().toISOString(),
      };
    } else if (randomStatus === 'FAILED') {
      response.error = {
        code: 500,
        message: 'Mock operation failed for testing purposes',
      };
    } else {
      response.metadata.progress = Math.floor(Math.random() * 100);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  // Real operation status check
  try {
    if (!auth) {
      throw new Error('Google Cloud authentication not configured');
    }

    const token = await auth.getAccessToken();
    const endpoint = `https://${config.location}-aiplatform.googleapis.com/v1/${operationName}`;

    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('Operation status check error:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    // Initialize configuration
    initializeConfig();
    
    console.error(`Google AI MCP Server v1.0.0`);
    console.error(`Project: ${config.projectId}`);
    console.error(`Location: ${config.location}`);
    console.error(`Mode: ${USE_MOCK ? 'MOCK' : 'PRODUCTION'}`);
    
    if (USE_MOCK) {
      console.error('\n⚠️  Running in MOCK mode. Set GOOGLE_CLOUD_PROJECT to use real APIs.');
    } else {
      console.error('\n✓ Connected to Google Cloud');
    }
    
    console.error('\nAvailable tools:');
    tools.forEach(tool => {
      console.error(`  - ${tool.name}: ${tool.description}`);
    });
    
    // Start the server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('\nGoogle AI MCP Server running on stdio');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
