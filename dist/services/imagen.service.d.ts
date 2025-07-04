import { BaseGoogleService } from './base.service.js';
import { ImagenConfig, ImagenResponse } from '../types/imagen.types.js';
export declare class ImagenService extends BaseGoogleService {
    private auth;
    private readonly MAX_RETRIES;
    private readonly RETRY_DELAY;
    private readonly VALID_ASPECT_RATIOS;
    private readonly VALID_PERSON_GENERATION;
    constructor(apiKey: string, config?: ImagenConfig);
    generateImage(prompt: string, aspectRatio?: string, sampleCount?: number, negativePrompt?: string, personGeneration?: string, language?: string, outputStorageUri?: string): Promise<ImagenResponse>;
    private validateParameters;
    private buildRequestPayload;
    private callImagenAPI;
    private parseImagenResponse;
    private executeWithRetry;
    private isRetryableError;
    private handleImagenError;
    private delay;
    private mockGenerateImage;
    private getRegion;
    private getProjectId;
}
export interface ImagenError {
    code: number;
    message: string;
    details?: any;
}
//# sourceMappingURL=imagen.service.d.ts.map