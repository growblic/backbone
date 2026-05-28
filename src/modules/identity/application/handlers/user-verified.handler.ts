import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserVerifiedEvent } from '../../domain/events/user-verified.event';

@Injectable()
export class UserVerifiedHandler {

  @OnEvent(UserVerifiedEvent.EVENT_NAME)
  async handle(event: UserVerifiedEvent) {  
  }
}