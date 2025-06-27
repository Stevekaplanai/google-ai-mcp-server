# Google AI MCP Server Examples

This directory contains examples of using the Google AI MCP Server with Claude Desktop.

## Video Generation (VEO 3)

### Basic Video Generation
```
Generate a 5-second video of "A peaceful Japanese garden with cherry blossoms falling gently in the breeze"
```

### Video with Specific Parameters
```
Use veo_generate_video with these parameters:
- prompt: "Cinematic shot of a futuristic city at night with neon lights"
- duration: 8
- aspectRatio: "16:9"
- negativePrompt: "blurry, low quality"
```

### Image-to-Video
```
Convert this image [attach image] to a video with gentle camera movement and ambient lighting changes
```

## Image Generation (Imagen 4)

### Product Photography
```
Generate 4 product photos using imagen_generate_image:
- prompt: "Minimalist smartwatch on white background, professional product photography"
- sampleCount: 4
- aspectRatio: "1:1"
```