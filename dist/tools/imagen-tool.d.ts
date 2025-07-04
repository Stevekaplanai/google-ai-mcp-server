export declare class ImagenTool {
    private service;
    constructor(apiKey: string, config?: any);
    /**
     * Handle the imagen_generate_image tool call
     */
    handleGenerateImage(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    /**
     * Validate and extract parameters from the tool arguments
     */
    private validateAndExtractParams;
    /**
     * Get tool definition for MCP
     */
    static getToolDefinition(): {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                prompt: {
                    type: string;
                    description: string;
                };
                sampleCount: {
                    type: string;
                    minimum: number;
                    maximum: number;
                    default: number;
                    description: string;
                };
                aspectRatio: {
                    enum: string[];
                    default: string;
                    description: string;
                };
                negativePrompt: {
                    type: string;
                    description: string;
                };
                personGeneration: {
                    enum: string[];
                    default: string;
                    description: string;
                };
                language: {
                    type: string;
                    default: string;
                    description: string;
                };
                outputStorageUri: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
}
//# sourceMappingURL=imagen-tool.d.ts.map