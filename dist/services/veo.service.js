"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeoService = void 0;
const google_auth_library_1 = require("google-auth-library");
const base_service_js_1 = require("./base.service.js");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class VeoService extends base_service_js_1.BaseGoogleService {
    auth;
    MAX_RETRIES = 3;
    RETRY_DELAY = 2000;
    VALID_ASPECT_RATIOS = ['16:9', '9:16', '1:1'];
    VALID_PERSON_GENERATION = ['allow', 'disallow'];
    MIN_DURATION = 5;
    MAX_DURATION = 8;
    constructor(apiKey, config) {
        super(apiKey, config);
        // Initialize Google Auth with service account credentials
        const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (credentials) {
            try {
                let parsedCredentials = JSON.parse(credentials);
                // Fix the private key by replacing \\n with actual newlines
                if (parsedCredentials.private_key) {
                    parsedCredentials.private_key = parsedCredentials.private_key.replace(/\\n/g, '\n');
                }
                this.auth = new google_auth_library_1.GoogleAuth({
                    credentials: parsedCredentials,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform']
                });
            }
            catch (error) {
                console.error('Failed to parse service account credentials:', error);
                this.auth = new google_auth_library_1.GoogleAuth({
                    scopes: ['https://www.googleapis.com/auth/cloud-platform']
                });
            }
        }
        else {
            // Fall back to Application Default Credentials
            this.auth = new google_auth_library_1.GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            });
        }
    }
    async generateVideo(request) {
        // Validate parameters
        this.validateRequest(request);
        const useMock = this.mockMode || process.env.USE_MOCK === 'true';
        if (useMock) {
            return this.generateMockResponse(request);
        }
        try {
            return await this.executeWithRetry(() => this.callVeoAPI(request));
        }
        catch (error) {
            console.error('[VeoService] Failed to generate video:', error);
            throw error;
        }
    }
    validateRequest(request) {
        if (!request.prompt?.trim()) {
            throw new Error('Prompt is required');
        }
        if (request.aspectRatio && !this.VALID_ASPECT_RATIOS.includes(request.aspectRatio)) {
            throw new Error(`Invalid aspect ratio. Must be one of: ${this.VALID_ASPECT_RATIOS.join(', ')}`);
        }
        if (request.duration && (request.duration < this.MIN_DURATION || request.duration > this.MAX_DURATION)) {
            throw new Error(`Duration must be between ${this.MIN_DURATION} and ${this.MAX_DURATION} seconds`);
        }
        if (request.personGeneration && !this.VALID_PERSON_GENERATION.includes(request.personGeneration)) {
            throw new Error(`Invalid person generation. Must be one of: ${this.VALID_PERSON_GENERATION.join(', ')}`);
        }
        if (request.sampleCount && (request.sampleCount < 1 || request.sampleCount > 4)) {
            throw new Error('Sample count must be between 1 and 4');
        }
    }
    async callVeoAPI(request) {
        const accessToken = await this.auth.getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        // Construct request payload for VEO 3
        const payload = {
            instances: [{
                    prompt: request.prompt,
                    ...(request.imageBase64 && { image: { bytesBase64Encoded: request.imageBase64 } }),
                }],
            parameters: {
                sampleCount: request.sampleCount || 1,
                aspectRatio: request.aspectRatio || '16:9',
                duration: request.duration || 5,
                ...(request.negativePrompt && { negativePrompt: request.negativePrompt }),
                personGeneration: request.personGeneration || 'allow',
                ...(request.outputStorageUri && { outputStorageUri: request.outputStorageUri }),
            }
        };
        // Construct the endpoint URL for VEO 3
        const projectId = this.getProjectId();
        const location = this.getRegion();
        // Possible VEO model names (will need to be confirmed when you get access):
        // - veo-003
        // - veo-3
        // - veo-1.0-001
        // - videopoet
        // - imagen-video
        const modelName = 'videogeneration@001'; // VEO 3 model name confirmed!
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelName}:predict`;
        this.log('Calling VEO API', { endpoint, sampleCount: payload.parameters.sampleCount });
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
            console.error('[VeoService] VEO API error', {
                status: response.status,
                statusText: response.statusText,
                response: errorText
            });
            throw new Error(`VEO generation failed: ${errorText}`);
        }
        const data = await response.json();
        return this.formatResponse(data, request);
    }
    formatResponse(apiResponse, request) {
        const videos = apiResponse.predictions?.map((prediction, index) => ({
            uri: prediction.videoUri || prediction.uri,
            previewUri: prediction.previewUri,
            metadata: {
                duration: request.duration || 5,
                aspectRatio: request.aspectRatio || '16:9',
                format: 'mp4',
                hasAudio: true,
                resolution: this.getResolution(request.aspectRatio || '16:9'),
                frameRate: 30
            }
        })) || [];
        return {
            operationName: apiResponse.operationName,
            videos,
            metadata: {
                model: 'veo-003',
                generatedAt: new Date().toISOString(),
                totalVideos: videos.length
            }
        };
    }
    getResolution(aspectRatio) {
        switch (aspectRatio) {
            case '16:9': return '1920x1080';
            case '9:16': return '1080x1920';
            case '1:1': return '1080x1080';
            default: return '1920x1080';
        }
    }
    getProjectId() {
        return this.config.projectId || process.env.GOOGLE_CLOUD_PROJECT || 'starry-center-464218-r3';
    }
    getRegion() {
        return this.config.location || process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    }
    async executeWithRetry(operation) {
        let lastError = null;
        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                this.log(`Attempt ${attempt} failed:`, error);
                if (attempt < this.MAX_RETRIES) {
                    await this.delay(this.RETRY_DELAY * attempt);
                }
            }
        }
        throw lastError || new Error('Operation failed after retries');
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    generateMockResponse(request) {
        const operationId = `mock-veo-${Date.now()}`;
        const sampleCount = request.sampleCount || 1;
        const videos = [];
        for (let i = 0; i < sampleCount; i++) {
            videos.push({
                uri: `gs://mock-bucket/veo-output/${operationId}/video_${i}.mp4`,
                previewUri: `https://storage.googleapis.com/mock-bucket/veo-output/${operationId}/preview_${i}.gif`,
                metadata: {
                    duration: request.duration || 5,
                    aspectRatio: request.aspectRatio || '16:9',
                    format: 'mp4',
                    hasAudio: true,
                    resolution: this.getResolution(request.aspectRatio || '16:9'),
                    frameRate: 30
                }
            });
        }
        return {
            operationName: `projects/${this.getProjectId()}/locations/${this.getRegion()}/operations/${operationId}`,
            videos,
            metadata: {
                model: 'veo-003',
                generatedAt: new Date().toISOString(),
                totalVideos: videos.length
            }
        };
    }
    // Method to save generated videos locally (for testing)
    async saveVideosLocally(response, outputDir = './generated-videos') {
        await promises_1.default.mkdir(outputDir, { recursive: true });
        for (let i = 0; i < response.videos.length; i++) {
            const video = response.videos[i];
            // In real implementation, you would download from GCS
            // For mock, we'll create a placeholder file
            const filename = path_1.default.join(outputDir, `veo-video-${Date.now()}-${i}.mp4`);
            if (process.env.USE_MOCK === 'true') {
                // Create a placeholder text file for mock mode
                await promises_1.default.writeFile(filename + '.placeholder', `Mock video file\nURI: ${video.uri}\nDuration: ${video.metadata.duration}s\nAspect Ratio: ${video.metadata.aspectRatio}`);
                console.log(`Created placeholder: ${filename}.placeholder`);
            }
        }
    }
}
exports.VeoService = VeoService;
//# sourceMappingURL=veo.service.js.map