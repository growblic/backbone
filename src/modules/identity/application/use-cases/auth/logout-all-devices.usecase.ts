import {
  Injectable,
} from '@nestjs/common';

import { SessionService } from '@modules/identity/application/services/session.service';

@Injectable()
export class LogoutAllDevicesUseCase {
  constructor(
    private readonly sessionService: SessionService,
  ) {}

  async execute(userId: string) {
    await this.sessionService.deleteAllUserSessions(
      userId,
    );

    return {
      message:
        'Logged out from all devices successfully',
    };
  }
}