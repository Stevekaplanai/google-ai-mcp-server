#!/usr/bin/env node
import { McpServer, StdioServerTransport } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

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
// Tool parameter schemas
const VeoGenerateSchema = z.object({
  prompt: z.string().describe('Text prompt for video generation'),
  imageBase64: z.string().optional().describe('Base64-encoded image for image-to-video generation'),
  duration: z.number().min(5).max(8).default(5).describe('Video duration in seconds'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).default('16:9').describe('Video aspect ratio'),
  sampleCount: z.number().min(1).max(4).default(1).describe('Number of videos to generate'),
  negativePrompt: z.string().optional().describe('What to avoid in the generation'),
  personGeneration: z.enum(['allow', 'disallow']).default('allow').describe('Whether to allow person generation'),
  outputStorageUri: z.string().optional().describe('GCS bucket URI for output (e.g., gs://bucket/path/)'),
});

const ImagenGenerateSchema = z.object({
  prompt: z.string().describe('Text prompt for image generation'),
  sampleCount: z.number().min(1).max(8).default(1).describe('Number of images to generate'),
  aspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4']).default('1:1').describe('Image aspect ratio'),
  negativePrompt: z.string().optional().describe('What to avoid in the generation'),
  personGeneration: z.enum(['allow', 'disallow']).default('allow').describe('Whether to allow person generation'),
  language: z.string().default('en').describe('Language for the prompt'),
  outputStorageUri: z.string().optional().describe('GCS bucket URI for output'),
});