"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenService = void 0;
const google_auth_library_1 = require("google-auth-library");
const base_service_js_1 = require("./base.service.js");
class ImagenService extends base_service_js_1.BaseGoogleService {
    auth;
    MAX_RETRIES = 3;
    RETRY_DELAY = 1000;
    VALID_ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    VALID_PERSON_GENERATION = ['allow', 'disallow'];
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
    async generateImage(prompt, aspectRatio = '1:1', sampleCount = 1, negativePrompt, personGeneration = 'allow', language = 'en', outputStorageUri) {
        if (this.mockMode) {
            return this.mockGenerateImage(prompt, aspectRatio, sampleCount);
        }
        try {
            // Validate parameters
            this.validateParameters({
                prompt,
                aspectRatio,
                sampleCount,
                personGeneration,
                language
            });
            // Build request payload
            const requestPayload = this.buildRequestPayload({
                prompt,
                aspectRatio,
                sampleCount,
                negativePrompt,
                personGeneration,
                language,
                outputStorageUri
            });
            // Execute with retry logic
            const response = await this.executeWithRetry(() => this.callImagenAPI(requestPayload));
            return this.parseImagenResponse(response);
        }
        catch (error) {
            throw this.handleImagenError(error);
        }
    }
    validateParameters(params) {
        // Validate prompt
        if (!params.prompt || params.prompt.trim().length === 0) {
            throw new Error('Prompt cannot be empty');
        }
        if (params.prompt.length > 10000) {
            throw new Error('Prompt exceeds maximum length of 10,000 characters');
        }
        // Validate aspect ratio
        if (!this.VALID_ASPECT_RATIOS.includes(params.aspectRatio)) {
            throw new Error(`Invalid aspect ratio. Must be one of: ${this.VALID_ASPECT_RATIOS.join(', ')}`);
        }
        // Validate sample count
        if (params.sampleCount < 1 || params.sampleCount > 8) {
            throw new Error('Sample count must be between 1 and 8');
        }
        // Validate person generation
        if (!this.VALID_PERSON_GENERATION.includes(params.personGeneration)) {
            throw new Error(`Invalid person generation setting. Must be one of: ${this.VALID_PERSON_GENERATION.join(', ')}`);
        }
        // Validate language code (basic check)
        if (params.language.length !== 2) {
            throw new Error('Language must be a 2-letter ISO code');
        }
    }
    buildRequestPayload(params) {
        const payload = {
            instances: [{
                    prompt: params.prompt
                }],
            parameters: {
                sampleCount: params.sampleCount,
                aspectRatio: params.aspectRatio,
                addWatermark: false,
                safetySetting: params.personGeneration === 'disallow' ? 'block_all' : 'default',
                language: params.language
            }
        };
        if (params.negativePrompt) {
            payload.parameters.negativePrompt = params.negativePrompt;
        }
        if (params.outputStorageUri) {
            payload.parameters.storageUri = params.outputStorageUri;
        }
        return payload;
    }
    async callImagenAPI(payload) {
        try {
            // Get authenticated client
            const client = await this.auth.getClient();
            // Get access token
            const accessToken = await client.getAccessToken();
            if (!accessToken.token) {
                throw new Error('Failed to obtain access token');
            }
            // Construct the endpoint URL for Imagen 4
            const projectId = this.getProjectId();
            const location = this.getRegion();
            const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;
            this.log('Calling Imagen API', { endpoint, sampleCount: payload.parameters.sampleCount });
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            const responseText = await response.text();
            if (!response.ok) {
                this.logError('Imagen API error', {
                    status: response.status,
                    statusText: response.statusText,
                    response: responseText
                });
                let errorMessage = `Imagen API error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = JSON.parse(responseText);
                    if (errorData.error?.message) {
                        errorMessage = errorData.error.message;
                    }
                }
                catch (e) {
                    // If response is not JSON, use the text
                    errorMessage += `: ${responseText}`;
                }
                throw new Error(errorMessage);
            }
            return JSON.parse(responseText);
        }
        catch (error) {
            this.logError('Failed to call Imagen API', error);
            throw error;
        }
    }
    parseImagenResponse(response) {
        const predictions = response.predictions || [];
        const images = [];
        predictions.forEach((prediction, index) => {
            if (prediction.bytesBase64Encoded) {
                images.push({
                    base64: prediction.bytesBase64Encoded,
                    mimeType: prediction.mimeType || 'image/png',
                    generationId: `imagen-${Date.now()}-${index}`
                });
            }
        });
        if (images.length === 0) {
            throw new Error('No images were generated');
        }
        return {
            images,
            metadata: {
                model: 'imagen-3.0-generate-001',
                generatedAt: new Date().toISOString(),
                totalImages: images.length
            }
        };
    }
    async executeWithRetry(operation, retryCount = 0) {
        try {
            return await operation();
        }
        catch (error) {
            if (retryCount >= this.MAX_RETRIES) {
                throw error;
            }
            // Check if error is retryable
            if (this.isRetryableError(error)) {
                const delay = this.RETRY_DELAY * Math.pow(2, retryCount);
                this.log(`Retrying after ${delay}ms (attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
                await this.delay(delay);
                return this.executeWithRetry(operation, retryCount + 1);
            }
            throw error;
        }
    }
    isRetryableError(error) {
        // Retry on rate limits, temporary failures
        const retryableCodes = [429, 503, 504];
        if (error.status && retryableCodes.includes(error.status)) {
            return true;
        }
        // Check for specific error messages
        const retryableMessages = ['rate limit', 'temporarily unavailable', 'timeout', 'quota exceeded'];
        const errorMessage = error.message?.toLowerCase() || '';
        return retryableMessages.some(msg => errorMessage.includes(msg));
    }
    handleImagenError(error) {
        // Handle specific Imagen API errors
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
            return new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.message?.includes('400') || error.message?.includes('invalid')) {
            return new Error(`Invalid request: ${error.message || 'Check your parameters'}`);
        }
        if (error.message?.includes('403') || error.message?.includes('permission')) {
            return new Error('Permission denied. Check your API access and project permissions.');
        }
        if (error.message?.includes('safety') || error.message?.includes('blocked')) {
            return new Error('Content was blocked by safety filters. Try modifying your prompt.');
        }
        if (error.message?.includes('quota')) {
            return new Error('Quota exceeded. Check your project quotas in Google Cloud Console.');
        }
        return new Error(`Imagen generation failed: ${error.message || 'Unknown error'}`);
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    mockGenerateImage(prompt, aspectRatio, sampleCount) {
        this.log('Generating mock images', { prompt, aspectRatio, sampleCount });
        const mockImages = Array(sampleCount).fill(null).map((_, index) => ({
            base64: `mock-base64-image-data-${index}-for-prompt-${prompt.substring(0, 20)}`,
            mimeType: 'image/png',
            generationId: `mock-imagen-${Date.now()}-${index}`
        }));
        return {
            images: mockImages,
            metadata: {
                model: 'imagen-3.0-generate-001',
                generatedAt: new Date().toISOString(),
                totalImages: mockImages.length,
                mockData: true
            }
        };
    }
    // Helper methods for configuration
    getRegion() {
        return process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    }
    getProjectId() {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT;
        if (!projectId) {
            throw new Error('GOOGLE_CLOUD_PROJECT environment variable is required');
        }
        return projectId;
    }
}
exports.ImagenService = ImagenService;
//# sourceMappingURL=imagen.service.js.map