import { Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { dynamicRoutesMapping } from 'src/shared/constant';
import { RouteMapping } from 'src/shared/interfaces';

export class RequestMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(RequestMiddleware.name);

  use(req: Request, res: Response, next: (error?: any) => void) {
    this.logger.log(`Request Received -> ${req.originalUrl} `);

    const route: RouteMapping[] = dynamicRoutesMapping.filter(
      (route: RouteMapping) => req.originalUrl.startsWith(route.routeName)
    );

    if (route[0]) {
      return createProxyMiddleware({
        target: route[0].routePath,
        changeOrigin: true,
        pathRewrite: (path, req: Request) => {
          const matchedRoute = route[0].routeName;
          const rewritten = req.originalUrl.replace(
            new RegExp(`^${matchedRoute}`),
            ''
          );
          this.logger.log(
            `Rewriting path ${req.originalUrl} to -> ${rewritten}`
          );
          return rewritten;
        },
        on: {
          proxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-API-Gateway', 'NestJS-GW');

            // proxyReq.setHeader('X-Forwarded-For', req.ip);

            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
            }
          },
          proxyRes: (proxyRes, req, res) => {
            delete proxyRes.headers['x-powered-by'];

            proxyRes.headers['X-Proxied-By'] = 'NestJS-API-Gateway';
          },
        },
      })(req, res, next);
    }

    next();
  }
}
