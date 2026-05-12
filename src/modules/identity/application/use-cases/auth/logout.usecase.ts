import { Injectable } from '@nestjs/common';
import { SessionService } from '@modules/identity/application/services/session.service';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly sessionService: SessionService) {}

  async execute(sessionId: string) {
    await this.sessionService.deleteSession(sessionId);
    return { message: 'Logged out successfully' };
  }
}