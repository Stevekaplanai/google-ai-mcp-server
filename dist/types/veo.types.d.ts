export interface VeoConfig {
    projectId?: string;
    location?: string;
    apiKey?: string;
    mockMode?: boolean;
    debug?: boolean;
}
export interface VeoVideoMetadata {
    duration: number;
    aspectRatio: string;
    format: string;
    hasAudio: boolean;
    resolution: string;
    fileSize?: string;
    frameRate?: number;
}
export interface VeoVideo {
    uri: string;
    previewUri?: string;
    metadata: VeoVideoMetadata;
}
export interface VeoResponse {
    operationName?: string;
    videos: VeoVideo[];
    metadata: {
        model: string;
        generatedAt: string;
        totalVideos: number;
        processingTime?: number;
    };
}
export interface VeoGenerateRequest {
    prompt: string;
    imageBase64?: string;
    duration?: number;
    aspectRatio?: '16:9' | '9:16' | '1:1';
    sampleCount?: number;
    negativePrompt?: string;
    personGeneration?: 'allow' | 'disallow';
    outputStorageUri?: string;
}
//# sourceMappingURL=veo.types.d.ts.map