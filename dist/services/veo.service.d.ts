import { BaseGoogleService } from './base.service.js';
import { VeoConfig, VeoResponse, VeoGenerateRequest } from '../types/veo.types.js';
export declare class VeoService extends BaseGoogleService {
    private auth;
    private readonly MAX_RETRIES;
    private readonly RETRY_DELAY;
    private readonly VALID_ASPECT_RATIOS;
    private readonly VALID_PERSON_GENERATION;
    private readonly MIN_DURATION;
    private readonly MAX_DURATION;
    constructor(apiKey: string, config?: VeoConfig);
    generateVideo(request: VeoGenerateRequest): Promise<VeoResponse>;
    private validateRequest;
    private callVeoAPI;
    private formatResponse;
    private getResolution;
    private getProjectId;
    private getRegion;
    private executeWithRetry;
    private delay;
    private generateMockResponse;
    saveVideosLocally(response: VeoResponse, outputDir?: string): Promise<void>;
}
//# sourceMappingURL=veo.service.d.ts.map