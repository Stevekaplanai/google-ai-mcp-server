/**
 * Lyria 2 Music Generation Service
 *
 * CURRENT STATUS (July 2025):
 * - Lyria 2 API is NOT publicly available through Google Cloud or AI Studio
 * - This service operates in MOCK MODE only
 * - Real API integration will be added when Google releases Lyria API
 *
 * WHERE LYRIA 2 EXISTS:
 * - MusicFX (AI Test Kitchen): https://aitestkitchen.withgoogle.com/tools/music-fx
 * - YouTube Dream Track (select creators only)
 * - Google Labs experiments
 *
 * ALTERNATIVES FOR PRODUCTION USE:
 * - MusicGen (Meta) via Replicate
 * - Stable Audio (Stability AI)
 * - AudioLDM2 via Hugging Face
 *
 * This implementation is ready for when Google releases the Lyria API.
 * Expected model name patterns: musicgeneration@001, lyria@001, or similar
 */
import { BaseGoogleService } from './base.service.js';
import type { LyriaGenerateRequest, LyriaGenerateResponse, LyriaConfig } from '../types/lyria.types.js';
export declare class LyriaService extends BaseGoogleService {
    private readonly projectId;
    private readonly location;
    private readonly auth;
    private readonly MAX_RETRIES;
    private readonly RETRY_DELAY;
    constructor(config: LyriaConfig);
    generateMusic(request: LyriaGenerateRequest): Promise<LyriaGenerateResponse>;
    private validateRequest;
    private callLyriaAPI;
    private processApiResponse;
    private generateMockResponse;
    getOperationStatus(operationName: string): Promise<LyriaGenerateResponse>;
    private getAccessToken;
    private executeWithRetry;
    private delay;
}
//# sourceMappingURL=lyria.service.d.ts.map