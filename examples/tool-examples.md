# Google AI MCP Server Examples

This document provides example usage for all tools available in the Google AI MCP Server.

## Available Tools

### 1. **veo_generate_video** - Generate AI Videos with VEO 3

Generate 5-8 second videos with synchronized audio using Google's VEO 3 model.

**Example Usage:**
```json
{
  "tool": "veo_generate_video",
  "arguments": {
    "prompt": "A serene waterfall in a lush forest with birds chirping",
    "duration": 5,
    "aspectRatio": "16:9",
    "sampleCount": 2,
    "negativePrompt": "people, text, logos",
    "personGeneration": "disallow"
  }
}
```

**Image-to-Video Example:**
```json
{
  "tool": "veo_generate_video",
  "arguments": {
    "prompt": "Make this image come alive with gentle motion",
    "imageBase64": "data:image/jpeg;base64,...",
    "duration": 8,
    "aspectRatio": "1:1"
  }
}
```

### 2. **imagen_generate_image** - Generate Photorealistic Images

Create high-quality images with Imagen 4, Google's latest image generation model.

**Example Usage:**
```json
{
  "tool": "imagen_generate_image",
  "arguments": {
    "prompt": "A modern minimalist home office with plants and natural lighting",
    "sampleCount": 4,
    "aspectRatio": "16:9",
    "negativePrompt": "clutter, messy, dark",
    "language": "en"
  }
}
```

**Portrait Example:**
```json
{
  "tool": "imagen_generate_image",
  "arguments": {
    "prompt": "Professional headshot of a business person, formal attire",
    "aspectRatio": "3:4",
    "personGeneration": "allow"
  }
}
```

### 3. **gemini_generate_text** - Generate Text with Gemini

Use Google's Gemini models for text generation, analysis, and conversation.

**Creative Writing Example:**
```json
{
  "tool": "gemini_generate_text",
  "arguments": {
    "prompt": "Write a short story about a time traveler who can only move forward in 5-minute increments",
    "model": "gemini-1.5-pro",
    "temperature": 0.9,
    "maxTokens": 2000
  }
}
```

**Code Generation Example:**
```json
{
  "tool": "gemini_generate_text",
  "arguments": {
    "prompt": "Create a Python function that implements binary search on a sorted list",
    "model": "gemini-1.5-flash",
    "temperature": 0.2,
    "systemInstruction": "You are an expert Python developer. Provide clean, efficient, and well-commented code."
  }
}
```

**Analysis Example:**
```json
{
  "tool": "gemini_generate_text",
  "arguments": {
    "prompt": "Analyze the following sales data and provide insights: Q1: $1.2M, Q2: $1.5M, Q3: $1.1M, Q4: $2.1M",
    "model": "gemini-2.0-flash-exp",
    "temperature": 0.5,
    "maxTokens": 1000
  }
}
```

### 4. **lyria_generate_music** - Generate Music with Lyria 2

Create original music tracks up to 60 seconds long using Google's Lyria 2 model.

**Ambient Music Example:**
```json
{
  "tool": "lyria_generate_music",
  "arguments": {
    "textPrompt": "Calm ambient music for meditation with soft piano and nature sounds",
    "musicalStructure": "free-form",
    "genre": "ambient",
    "mood": "peaceful",
    "tempo": "slow",
    "durationSeconds": 45
  }
}
```

**Upbeat Track Example:**
```json
{
  "tool": "lyria_generate_music",
  "arguments": {
    "textPrompt": "Energetic electronic dance music with strong bass and catchy melody",
    "musicalStructure": "verse-chorus",
    "genre": "electronic",
    "mood": "energetic",
    "tempo": "fast",
    "durationSeconds": 30
  }
}
```

### 5. **check_operation_status** - Check Long-Running Operations

Monitor the status of video and music generation operations.

**Example Usage:**
```json
{
  "tool": "check_operation_status",
  "arguments": {
    "operationName": "projects/your-project/locations/us-central1/operations/operation-123456"
  }
}
```

## Claude Desktop Integration Examples

When using these tools in Claude Desktop, you can naturally ask for content generation:

**Natural Language Examples:**
- "Generate a video of a sunset over the ocean with calming waves"
- "Create 4 images of modern kitchen designs in different styles"
- "Write a blog post about the future of AI in marketing"
- "Generate a 30-second upbeat background music for a product demo"
- "Check the status of my video generation operation"

## Response Format

All tools return responses in a consistent format:

**Success Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON string with results"
    }
  ]
}
```

**Error Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Description of what went wrong"
    }
  ]
}
```

## Mock Mode

When `USE_MOCK=true`, all tools return realistic mock responses for testing:
- Mock operation IDs for tracking
- Fake storage URIs and download links
- Simulated processing times
- Example metadata and parameters

This allows full testing of integrations without consuming API credits or requiring full authentication.

## Best Practices

1. **Prompts**: Be specific and descriptive for better results
2. **Negative Prompts**: Use to exclude unwanted elements
3. **Aspect Ratios**: Choose based on your intended use case
4. **Sample Count**: Generate multiple options to choose from
5. **Temperature**: Lower for consistency, higher for creativity
6. **Error Handling**: Always check operation status for long-running tasks

## Rate Limits and Quotas

- **Imagen 4**: Up to 8 images per request
- **VEO 3**: Up to 4 videos per request, 5-8 seconds each
- **Gemini**: Token limits vary by model (up to 8192)
- **Lyria 2**: Up to 60 seconds of audio per request

Note: Actual quotas depend on your Google Cloud project limits.
