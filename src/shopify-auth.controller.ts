import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpCode, Query, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Controller('shopify-oauth')
export class ShopifyAuthController {
    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {}

    private globalAccessToken = "";

    @Get('init')
    @HttpCode(302)
    @Redirect()
    async init(@Query() query: any) {
        console.log("Initializing Shopify OAuth");

        const shop = query.shop;
        if (!shop) {
            throw new Error('Missing shop parameter');
        }

        const clientId = this.configService.get('shopify.appProxy.clientId');
        const scopes = this.configService.get('shopify.appProxy.scopes').join(',');
        const redirectUri = `${this.configService.get('apiUrl')}/shopify-oauth/redirect`;
        const nonce = Math.random().toString(36).substring(7);

        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}&grant_options[]=per-user`;

        console.log('Auth URL:', authUrl);
        
        return { url: authUrl };
    }

    @Get('redirect')
    @HttpCode(302)
    @Redirect()
    async oauthRedirect(@Query() query: any) {
        console.log('OAuth redirect received:', query);

        if (!query.code || !query.shop) {
            throw new Error('Missing code or shop parameter');
        }

        try {
            const response = await lastValueFrom(
                this.httpService.post(
                    `https://${query.shop}/admin/oauth/access_token`,
                    {
                        client_id: this.configService.get('shopify.appProxy.clientId'),
                        client_secret: this.configService.get('shopify.appProxy.clientSecret'),
                        code: query.code
                    }
                )
            );

            console.log("Token Response:", JSON.stringify(response.data));
            this.globalAccessToken = response.data.access_token;

            return {
                url: `https://${query.shop}/admin/apps?shop=${query.shop}`
            };
        } catch (error) {
            console.error('Token exchange error:', error.response?.data || error.message);
            throw error;
        }
    }

    @Get('getproduct')
    async getProduct(@Query() query: any): Promise<any> {
        console.log('Fetching product:', query);

        if (!query.store || !query.productid) {
            throw new Error('Missing store or productid parameter');
        }

        if (!this.globalAccessToken) {
            throw new Error('No access token available');
        }

        try {
            const productResponse = await lastValueFrom(
                this.httpService.get(
                    `https://${query.store}/admin/api/2024-01/products/${query.productid}.json`,
                    {
                        headers: {
                            'X-Shopify-Access-Token': this.globalAccessToken
                        }
                    }
                )
            );

            console.log("Product Response:", JSON.stringify(productResponse.data));
            return productResponse.data;
        } catch (error) {
            console.error('Product fetch error:', error.response?.data || error.message);
            throw error;
        }
    }
}