export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    apiUrl: process.env.API_URL || 'https://pixmock.com',
    corsAllowedUrls: '*',
    shopify: {
        appProxy: {
            clientId: process.env.SHOPIFY_APP_PROXY_KEY || 'e2b20adf1c1b49a62ec2d42c0c119355',
            clientSecret: process.env.SHOPIFY_APP_PROXY_SECRET || 'c31a40911d06210a0fd1ff8ca4aa9715',
            scopes: [
                'read_customers',
                'write_customers',
                'read_orders',
                'write_orders',
                'write_products',
                'read_products'
            ]
        },
    },
});