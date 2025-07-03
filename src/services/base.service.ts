// Base service class for all Google AI services

export abstract class BaseGoogleService {
  protected apiKey: string;
  protected mockMode: boolean;
  protected config: any;

  constructor(apiKey: string, config?: any) {
    // Allow empty API key for services that use service account authentication
    if (!apiKey && !config?.mockMode && !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      throw new Error('API key or service account credentials required unless in mock mode');
    }
    
    this.apiKey = apiKey;
    this.mockMode = config?.mockMode || false;
    this.config = config || {};
  }

  /**
   * Log debug information if debug mode is enabled
   */
  protected log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[${this.constructor.name}] ${message}`, data || '');
    }
  }

  /**
   * Log error information
   */
  protected logError(message: string, error: any): void {
    console.error(`[${this.constructor.name}] ${message}`, error);
  }
  /**
   * Check if the service is in mock mode
   */
  protected isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Get configuration value
   */
  protected getConfig<T>(key: string, defaultValue?: T): T {
    return this.config[key] || defaultValue;
  }

  /**
   * Validate that required environment variables are set
   */
  protected validateEnvironment(requiredVars: string[]): void {
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }
  /**
   * Common error handler for Google API errors
   */
  protected handleGoogleAPIError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          return new Error(`Bad Request: ${data?.error?.message || 'Invalid parameters'}`);
        case 401:
          return new Error('Unauthorized: Check your API key');
        case 403:
          return new Error('Forbidden: Check your permissions');
        case 404:
          return new Error('Not Found: Resource does not exist');
        case 429:
          return new Error('Rate Limit Exceeded: Too many requests');
        case 500:
          return new Error('Internal Server Error');
        case 503:
          return new Error('Service Unavailable: Try again later');
        default:
          return new Error(`API Error (${status}): ${data?.error?.message || 'Unknown error'}`);
      }
    }
    
    return error;
  }
  /**
   * Format bytes to human readable string
   */
  protected formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate a unique ID
   */
  protected generateId(prefix: string = 'id'): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${randomStr}`;
  }
}