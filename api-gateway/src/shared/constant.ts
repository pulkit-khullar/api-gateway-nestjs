import { ConfigService } from '@nestjs/config';
import { RouteMapping } from './interfaces';

export const dynamicRoutesMapping = (
  configService: ConfigService
): RouteMapping[] => {
  return [
    {
      routeName: '/auth',
      routePath: configService.get<string>('AUTH_SERVICE_URL') || '',
    },
  ];
};
