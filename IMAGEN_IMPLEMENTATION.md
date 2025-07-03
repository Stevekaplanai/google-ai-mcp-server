# Google Imagen MCP Server Implementation

This implementation provides a complete integration of Google's Imagen 4 image generation service into the MCP (Model Context Protocol) server.

## Features

- ✅ **Complete Imagen 4 API integration**
- ✅ **Mock mode for development and testing**
- ✅ **Comprehensive error handling with retry logic**
- ✅ **Full TypeScript support with type definitions**
- ✅ **Extensive test coverage**
- ✅ **MCP tool handler for seamless integration**

## File Structure

```
src/
├── services/
│   ├── base.service.ts      # Base service class with common functionality
│   ├── imagen.service.ts    # Imagen service implementation
│   └── index.ts            # Service exports
├── tools/
│   ├── imagen-tool.ts      # MCP tool handler for Imagen
│   └── index.ts           # Tool exports
├── types/
│   ├── imagen.types.ts     # TypeScript type definitions
│   └── index.ts           # Type exports
└── index.ts               # Main MCP server file

tests/
├── services/
│   └── imagen.service.test.ts  # Imagen service tests
└── tools/
    └── imagen-tool.test.ts     # Tool handler tests
```

## Usage

### 1. Environment Setup

Create a `.env` file with the following variables:

```bash
# Required for real API calls
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_ACCESS_TOKEN=your-access-token

# Optional - for development
USE_MOCK=true  # Enable mock mode
```

### 2. Using the Imagen Service

```typescript
import { ImagenService } from './services/imagen.service';

// Initialize service
const service = new ImagenService('your-api-key');

// Generate a single image
const response = await service.generateImage(
  'A beautiful sunset over mountains',
  '16:9',  // aspect ratio
  1        // number of images
);

// Generate multiple images with negative prompt
const multiResponse = await service.generateImage(
  'A modern city skyline',
  '1:1',
  4,
  'no people, no cars',  // negative prompt
  'allow',               // person generation
  'en',                  // language
  'gs://my-bucket/output' // optional GCS output
);
```

### 3. Using Mock Mode

```typescript
// Initialize in mock mode for development
const mockService = new ImagenService('', { mockMode: true });

// Generate mock images
const mockResponse = await mockService.generateImage(
  'Test prompt',
  '16:9',
  2
);
// Returns mock base64 data for testing
```

### 4. MCP Tool Integration

The Imagen tool is automatically registered in the MCP server. Users can call it with:

```json
{
  "tool": "imagen_generate_image",
  "arguments": {
    "prompt": "A serene lake at dawn",
    "aspectRatio": "16:9",
    "sampleCount": 2,
    "negativePrompt": "no buildings",
    "personGeneration": "allow",
    "language": "en"
  }
}
```

## API Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| prompt | string | required | Text description of the image to generate |
| aspectRatio | enum | '1:1' | Image aspect ratio: '1:1', '16:9', '9:16', '4:3', '3:4' |
| sampleCount | number | 1 | Number of images to generate (1-8) |
| negativePrompt | string | undefined | What to avoid in the generation |
| personGeneration | enum | 'allow' | Whether to allow person generation: 'allow', 'disallow' |
| language | string | 'en' | Two-letter ISO language code |
| outputStorageUri | string | undefined | GCS bucket URI for output storage |

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Tests
```bash
# Test only the Imagen service
npm test imagen.service.test

# Test only the tool handler
npm test imagen-tool.test

# Run with coverage
npm test -- --coverage
```

### Test Coverage
The implementation includes comprehensive tests covering:
- ✅ Parameter validation
- ✅ API call formatting
- ✅ Response parsing
- ✅ Error handling
- ✅ Retry logic
- ✅ Mock mode
- ✅ Environment configuration

## Error Handling

The service handles various error scenarios:

1. **Rate Limiting** (429): Automatic retry with exponential backoff
2. **Permission Errors** (403): Clear error message about API key/permissions
3. **Invalid Requests** (400): Detailed parameter validation errors
4. **Safety Filters**: Specific handling for content blocked by safety filters
5. **Temporary Failures** (503, 504): Automatic retry up to 3 times

## Best Practices

1. **Use Mock Mode for Development**
   ```typescript
   const service = new ImagenService('', { mockMode: true });
   ```

2. **Handle Errors Gracefully**
   ```typescript
   try {
     const response = await service.generateImage(prompt);
   } catch (error) {
     if (error.message.includes('Rate limit')) {
       // Wait and retry
     } else if (error.message.includes('safety')) {
       // Modify prompt
     }
   }
   ```

3. **Batch Requests Efficiently**
   - Use sampleCount to generate multiple images in one request
   - Maximum 8 images per request

4. **Monitor Usage**
   - Track API calls to avoid rate limits
   - Use outputStorageUri for direct GCS storage to save bandwidth

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key is required" | Set USE_MOCK=true or provide valid API key |
| "GOOGLE_CLOUD_PROJECT environment variable is required" | Set GOOGLE_CLOUD_PROJECT in .env |
| "Rate limit exceeded" | Implement backoff strategy or reduce request frequency |
| "Content was blocked by safety filters" | Modify prompt to avoid sensitive content |
| "Permission denied" | Check API key permissions and project access |

## Next Steps

1. **Apply for VEO 3 Access**: Complete the allowlist application process
2. **Set up Authentication**: Configure Google Cloud credentials
3. **Test in Mock Mode**: Verify implementation with mock data
4. **Deploy to Production**: Use real API credentials when approved

---

Implementation completed successfully! The Imagen service is ready for use in both development (mock mode) and production environments.
