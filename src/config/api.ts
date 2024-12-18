const isProd = import.meta.env.PROD;

export const API_CONFIG = {
  // Webhook URLs
  webhooks: {
    mockupGeneration: 'https://hook.eu1.make.com/yp4gvxyfd6mctqgln6wqwg31uvla5f6u',
    mockupCreation: 'https://hook.eu1.make.com/bsbuo7abdrxgb94txqo02qrq31531oeq'
  },
  
  // Timeouts
  timeouts: {
    generation: 120000, // 120 seconds - increased for production
    upload: 30000      // 30 seconds
  },
  
  // Retry configuration
  retry: {
    attempts: 3,
    backoff: 2000 // 2 seconds between retries
  },

  // Validation
  validation: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/webp']
  }
};