import { ImagenTool } from '../../src/tools/imagen-tool';
import { ImagenService } from '../../src/services/imagen.service';

// Mock the service module
jest.mock('../../src/services/imagen.service');

describe('ImagenTool', () => {
  let tool: ImagenTool;
  let mockService: jest.Mocked<ImagenService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock instance
    mockService = {
      generateImage: jest.fn()
    } as any;

    // Mock the constructor
    (ImagenService as jest.MockedClass<typeof ImagenService>).mockImplementation(() => mockService);
    
    tool = new ImagenTool('test-api-key');
  });

  describe('handleGenerateImage', () => {
    it('should handle valid request successfully', async () => {
      const mockResponse = {
        images: [{
          base64: 'test-base64',
          mimeType: 'image/png',
          generationId: 'test-id'
        }],
        metadata: {
          model: 'imagen-4',
          generatedAt: new Date().toISOString(),
          totalImages: 1
        }
      };

      mockService.generateImage.mockResolvedValue(mockResponse);

      const args = {
        prompt: 'A beautiful landscape',
        aspectRatio: '16:9',
        sampleCount: 1
      };

      const result = await tool.handleGenerateImage(args);

      expect(mockService.generateImage).toHaveBeenCalledWith(
        'A beautiful landscape',
        '16:9',
        1,
        undefined,
        'allow',
        'en',
        undefined
      );

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      const parsedContent = JSON.parse(result.content[0].text);
      expect(parsedContent).toEqual(mockResponse);
    });
  });

    it('should handle all optional parameters', async () => {
      const args = {
        prompt: 'A sunset',
        aspectRatio: '4:3',
        sampleCount: 3,
        negativePrompt: 'no people',
        personGeneration: 'disallow',
        language: 'es',
        outputStorageUri: 'gs://my-bucket/output'
      };

      await tool.handleGenerateImage(args);

      expect(mockService.generateImage).toHaveBeenCalledWith(
        'A sunset',
        '4:3',
        3,
        'no people',
        'disallow',
        'es',
        'gs://my-bucket/output'
      );
    });

    it('should use default values when not provided', async () => {
      const args = {
        prompt: 'A mountain'
      };

      await tool.handleGenerateImage(args);

      expect(mockService.generateImage).toHaveBeenCalledWith(
        'A mountain',
        '1:1',      // default aspect ratio
        1,          // default sample count
        undefined,  // no negative prompt
        'allow',    // default person generation
        'en',       // default language
        undefined   // no storage URI
      );
    });

    it('should throw error when prompt is missing', async () => {
      const args = {
        aspectRatio: '16:9'
      };

      await expect(tool.handleGenerateImage(args))
        .rejects.toThrow('Prompt is required');
    });

    it('should propagate service errors', async () => {
      mockService.generateImage.mockRejectedValue(
        new Error('API Error: Rate limit exceeded')
      );

      const args = {
        prompt: 'A landscape'
      };

      await expect(tool.handleGenerateImage(args))
        .rejects.toThrow('API Error: Rate limit exceeded');
    });
  });

  describe('getToolDefinition', () => {
    it('should return correct tool definition', () => {
      const definition = ImagenTool.getToolDefinition();

      expect(definition.name).toBe('imagen_generate_image');
      expect(definition.description).toContain('Google Imagen');
      expect(definition.inputSchema.type).toBe('object');
      expect(definition.inputSchema.required).toEqual(['prompt']);
    });

    it('should have all required properties in schema', () => {
      const definition = ImagenTool.getToolDefinition();
      const properties = definition.inputSchema.properties;

      expect(properties.prompt).toBeDefined();
      expect(properties.prompt.type).toBe('string');
      
      expect(properties.aspectRatio).toBeDefined();
      expect(properties.aspectRatio.enum).toEqual(['1:1', '16:9', '9:16', '4:3', '3:4']);
      
      expect(properties.sampleCount).toBeDefined();
      expect(properties.sampleCount.minimum).toBe(1);
      expect(properties.sampleCount.maximum).toBe(8);
      
      expect(properties.personGeneration).toBeDefined();
      expect(properties.personGeneration.enum).toEqual(['allow', 'disallow']);
    });
  });
});
