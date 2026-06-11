import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('ADMIN_API_KEY');
    if (!expected) {
      throw new ForbiddenException('ADMIN_API_KEY is not set on the server');
    }

    const req = context.switchToHttp().getRequest();
    const headerKey = req.headers['x-admin-key'] as string | undefined;
    const auth = req.headers['authorization'] as string | undefined;
    const bearer =
      auth?.startsWith('Bearer ')
        ? auth.slice('Bearer '.length).trim()
        : undefined;

    const ok = headerKey === expected || bearer === expected;
    if (!ok) {
      throw new ForbiddenException('Invalid admin key');
    }
    return true;
  }
}
