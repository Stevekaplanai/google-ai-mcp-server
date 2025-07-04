export interface ImagenConfig {
    mockMode?: boolean;
    region?: string;
    projectId?: string;
    debug?: boolean;
}
export interface ImagenResponse {
    images: ImagenImage[];
    metadata: ImagenMetadata;
}
export interface ImagenImage {
    base64: string;
    mimeType: string;
    generationId: string;
}
export interface ImagenMetadata {
    model: string;
    generatedAt: string;
    totalImages: number;
    mockData?: boolean;
}
export interface ImagenGenerateParams {
    prompt: string;
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    sampleCount?: number;
    negativePrompt?: string;
    personGeneration?: 'allow' | 'disallow';
    language?: string;
    outputStorageUri?: string;
}
export interface ImagenError {
    code: number;
    message: string;
    details?: any;
}
export interface ImagenAPIRequest {
    instances: Array<{
        prompt: string;
    }>;
    parameters: {
        sampleCount: number;
        aspectRatio: string;
        personGeneration: string;
        language: string;
        negativePrompt?: string;
        storageUri?: string;
    };
}
export interface ImagenAPIResponse {
    predictions: Array<{
        bytesBase64Encoded: string;
        mimeType?: string;
    }>;
    metadata?: {
        model: string;
        modelVersion: string;
    };
}
//# sourceMappingURL=imagen.types.d.ts.map