import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { dynamicRoutesMapping } from 'src/shared/constant';
import { RouteMapping } from 'src/shared/interfaces';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestMiddleware.name);

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: (error?: any) => void) {
    this.logger.log(`Request Received -> ${req.originalUrl}`);

    const routeList: RouteMapping[] = dynamicRoutesMapping(this.configService);

    const matchedRoute = routeList.find((route) =>
      req.originalUrl.startsWith(route.routeName)
    );

    if (matchedRoute) {
      return createProxyMiddleware({
        target: matchedRoute.routePath,
        changeOrigin: true,
        pathRewrite: (path, req: Request) => {
          const rewritten = req.originalUrl.replace(
            new RegExp(`^${matchedRoute.routeName}`),
            ''
          );
          this.logger.log(
            `Rewriting path ${req.originalUrl} to -> ${rewritten}`
          );
          return rewritten;
        },
        timeout: 6000, // 1 minute
        proxyTimeout: 12000, // 2 minutes
        on: {
          proxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-API-Gateway', 'NestJS-GW');
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
            }
          },
          proxyRes: (proxyRes, req, res) => {
            console.log('Response Found');
            delete proxyRes.headers['x-powered-by'];
            proxyRes.headers['X-Proxied-By'] = 'NestJS-API-Gateway';
          },
          error: (proxyErr, req, res: Response) => {
            res.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            res.end(
              'Something went wrong. And we are reporting a custom error message.'
            );
          },
        },
      })(req, res, next);
    }

    next();
  }
}
