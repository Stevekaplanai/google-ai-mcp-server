export declare abstract class BaseGoogleService {
    protected apiKey: string;
    protected mockMode: boolean;
    protected config: any;
    constructor(apiKey: string, config?: any);
    /**
     * Log debug information if debug mode is enabled
     */
    protected log(message: string, data?: any): void;
    /**
     * Log error information
     */
    protected logError(message: string, error: any): void;
    /**
     * Check if the service is in mock mode
     */
    protected isMockMode(): boolean;
    /**
     * Get configuration value
     */
    protected getConfig<T>(key: string, defaultValue?: T): T;
    /**
     * Validate that required environment variables are set
     */
    protected validateEnvironment(requiredVars: string[]): void;
    /**
     * Common error handler for Google API errors
     */
    protected handleGoogleAPIError(error: any): Error;
    /**
     * Format bytes to human readable string
     */
    protected formatBytes(bytes: number): string;
    /**
     * Generate a unique ID
     */
    protected generateId(prefix?: string): string;
}
//# sourceMappingURL=base.service.d.ts.map