import { ImagenService } from '../../src/services/imagen.service';
import { ImagenConfig, ImagenResponse } from '../../src/types/imagen.types';

describe('ImagenService', () => {
  let service: ImagenService;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    // Mock environment variables
    process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
    process.env.GOOGLE_CLOUD_REGION = 'us-central1';
    process.env.GOOGLE_ACCESS_TOKEN = 'test-token';

    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Initialize service
    service = new ImagenService('test-api-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GOOGLE_CLOUD_REGION;
    delete process.env.GOOGLE_ACCESS_TOKEN;
  });

  describe('constructor', () => {
    it('should initialize with API key', () => {
      expect(() => new ImagenService('test-key')).not.toThrow();
    });

    it('should throw error if API key is missing and not in mock mode', () => {
      expect(() => new ImagenService('')).toThrow('API key is required unless in mock mode');
    });

    it('should initialize in mock mode without API key', () => {
      const mockService = new ImagenService('', { mockMode: true });
      expect(mockService).toBeDefined();
    });
  });

  describe('generateImage', () => {
    const validPrompt = 'A beautiful sunset over mountains';

    describe('mock mode', () => {
      let mockService: ImagenService;

      beforeEach(() => {
        mockService = new ImagenService('', { mockMode: true });
      });

      it('should generate mock images successfully', async () => {
        const response = await mockService.generateImage(validPrompt, '16:9', 2);

        expect(response).toBeDefined();
        expect(response.images).toHaveLength(2);
        expect(response.images[0].base64).toContain('mock-base64-image-data');
        expect(response.images[0].mimeType).toBe('image/png');
        expect(response.metadata.mockData).toBe(true);
      });

      it('should handle all aspect ratios in mock mode', async () => {
        const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
        
        for (const aspectRatio of aspectRatios) {
          const response = await mockService.generateImage(validPrompt, aspectRatio as any);
          expect(response).toBeDefined();
          expect(response.images).toHaveLength(1);
        }
      });
    });

    describe('validation', () => {
      it('should throw error for empty prompt', async () => {
        await expect(service.generateImage('')).rejects.toThrow('Prompt cannot be empty');
      });

      it('should throw error for prompt exceeding max length', async () => {
        const longPrompt = 'a'.repeat(10001);
        await expect(service.generateImage(longPrompt)).rejects.toThrow('Prompt exceeds maximum length of 10,000 characters');
      });

      it('should throw error for invalid aspect ratio', async () => {
        await expect(service.generateImage(validPrompt, '2:1' as any)).rejects.toThrow('Invalid aspect ratio');
      });

      it('should throw error for invalid sample count', async () => {
        await expect(service.generateImage(validPrompt, '1:1', 0)).rejects.toThrow('Sample count must be between 1 and 8');
        await expect(service.generateImage(validPrompt, '1:1', 9)).rejects.toThrow('Sample count must be between 1 and 8');
      });

      it('should throw error for invalid person generation setting', async () => {
        await expect(service.generateImage(
          validPrompt, 
          '1:1', 
          1, 
          undefined, 
          'maybe' as any
        )).rejects.toThrow('Invalid person generation setting');
      });

      it('should throw error for invalid language code', async () => {
        await expect(service.generateImage(
          validPrompt, 
          '1:1', 
          1, 
          undefined, 
          'allow', 
          'english'
        )).rejects.toThrow('Language must be a 2-letter ISO code');
      });
    });

    describe('API calls', () => {
      const mockSuccessResponse = {
        predictions: [
          {
            bytesBase64Encoded: 'test-base64-data',
            mimeType: 'image/png'
          }
        ]
      };

      beforeEach(() => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(mockSuccessResponse)
        });
      });

      it('should make correct API call with all parameters', async () => {
        await service.generateImage(
          validPrompt,
          '16:9',
          2,
          'avoid people',
          'disallow',
          'es',
          'gs://my-bucket/output'
        );

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('aiplatform.googleapis.com'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            }),
            body: expect.stringContaining('"prompt":"A beautiful sunset over mountains"')
          })
        );
      });

      it('should parse successful response correctly', async () => {
        const response = await service.generateImage(validPrompt);

        expect(response.images).toHaveLength(1);
        expect(response.images[0].base64).toBe('test-base64-data');
        expect(response.images[0].mimeType).toBe('image/png');
        expect(response.metadata.model).toBe('imagen-3.0-generate-001');
      });
    });

    describe('error handling', () => {
      it('should handle rate limit errors', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests'
        });

        await expect(service.generateImage(validPrompt))
          .rejects.toThrow('Rate limit exceeded. Please try again later.');
      });

      it('should handle permission errors', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 403,
          statusText: 'Forbidden'
        });

        await expect(service.generateImage(validPrompt))
          .rejects.toThrow('Permission denied. Check your API key and project permissions.');
      });

      it('should handle invalid request errors', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 400,
          statusText: 'Bad Request'
        });

        await expect(service.generateImage(validPrompt))
          .rejects.toThrow('Invalid request');
      });

      it('should handle safety filter errors', async () => {
        const error = new Error('Content blocked by safety filters');
        error.message = 'safety filter triggered';
        mockFetch.mockRejectedValue(error);

        await expect(service.generateImage(validPrompt))
          .rejects.toThrow('Content was blocked by safety filters');
      });
    });

    describe('retry logic', () => {
      it('should retry on temporary failures', async () => {
        // First two calls fail with 503, third succeeds
        mockFetch
          .mockResolvedValueOnce({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable'
          })
          .mockResolvedValueOnce({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable'
          })
          .mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({
              predictions: [{ bytesBase64Encoded: 'success' }]
            })
          });

        const response = await service.generateImage(validPrompt);
        
        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(response.images[0].base64).toBe('success');
      });

      it('should not retry on non-retryable errors', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 400,
          statusText: 'Bad Request'
        });

        await expect(service.generateImage(validPrompt)).rejects.toThrow();
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });

    describe('environment configuration', () => {
      it('should throw error when GOOGLE_CLOUD_PROJECT is missing', async () => {
        delete process.env.GOOGLE_CLOUD_PROJECT;

        await expect(service.generateImage(validPrompt))
          .rejects.toThrow('GOOGLE_CLOUD_PROJECT environment variable is required');
      });

      it('should throw error when GOOGLE_ACCESS_TOKEN is missing', async () => {
        delete process.env.GOOGLE_ACCESS_TOKEN;

        await expect(service.generateImage(validPrompt))
          .rejects.toThrow('Google access token not configured');
      });

      it('should use custom region when provided', async () => {
        process.env.GOOGLE_CLOUD_REGION = 'europe-west1';
        const customService = new ImagenService('test-key');
        
        await customService.generateImage(validPrompt);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('europe-west1-aiplatform.googleapis.com'),
          expect.any(Object)
        );
      });
    });
  });
});
