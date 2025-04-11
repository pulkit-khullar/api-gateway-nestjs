import { Logger, NestMiddleware } from "@nestjs/common";

export class RequestMiddleware implements NestMiddleware{
    private readonly logger: Logger = new Logger(RequestMiddleware.name)

    use(req: any, res: any, next: (error?: any) => void) {
        this.logger.log("Request Received");
        next();
    }
}