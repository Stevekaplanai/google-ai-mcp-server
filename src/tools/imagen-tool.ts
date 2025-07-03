import { ImagenService } from '../services/imagen.service.js';
import { ImagenGenerateParams } from '../types/imagen.types.js';

export class ImagenTool {
  private service: ImagenService;

  constructor(apiKey: string, config?: any) {
    this.service = new ImagenService(apiKey, config);
  }

  /**
   * Handle the imagen_generate_image tool call
   */
  async handleGenerateImage(args: any) {
    try {
      // Validate and extract parameters
      const params = this.validateAndExtractParams(args);
      
      // Call the service
      const response = await this.service.generateImage(
        params.prompt,
        params.aspectRatio,
        params.sampleCount,
        params.negativePrompt,
        params.personGeneration,
        params.language,
        params.outputStorageUri
      );

      // Format response for MCP
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate and extract parameters from the tool arguments
   */
  private validateAndExtractParams(args: any): ImagenGenerateParams {
    // Required parameters
    if (!args.prompt) {
      throw new Error('Prompt is required');
    }

    // Extract with defaults
    return {
      prompt: args.prompt,
      aspectRatio: args.aspectRatio || '1:1',
      sampleCount: args.sampleCount || 1,
      negativePrompt: args.negativePrompt,
      personGeneration: args.personGeneration || 'allow',
      language: args.language || 'en',
      outputStorageUri: args.outputStorageUri,
    };
  }

  /**
   * Get tool definition for MCP
   */
  static getToolDefinition() {
    return {
      name: 'imagen_generate_image',
      description: 'Generate photorealistic images using Google Imagen 4',
      inputSchema: {
        type: 'object',
        properties: {
          prompt: { 
            type: 'string', 
            description: 'Text prompt for image generation' 
          },
          sampleCount: { 
            type: 'number', 
            minimum: 1, 
            maximum: 8, 
            default: 1, 
            description: 'Number of images to generate' 
          },
          aspectRatio: { 
            enum: ['1:1', '16:9', '9:16', '4:3', '3:4'], 
            default: '1:1', 
            description: 'Image aspect ratio' 
          },
          negativePrompt: { 
            type: 'string', 
            description: 'What to avoid in the generation' 
          },
          personGeneration: { 
            enum: ['allow', 'disallow'], 
            default: 'allow', 
            description: 'Whether to allow person generation' 
          },
          language: { 
            type: 'string', 
            default: 'en', 
            description: 'Language for the prompt' 
          },
          outputStorageUri: { 
            type: 'string', 
            description: 'GCS bucket URI for output' 
          },
        },
        required: ['prompt'],
      },
    };
  }
}
