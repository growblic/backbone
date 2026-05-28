import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserCreatedEvent } from '@modules/identity/domain/events/user-created.event';
import { CreateWalletUseCase } from '@modules/wallets/application/use-cases/create-wallet.usecase';

@Injectable()
export class UserCreatedWalletHandler {
  constructor(
    private readonly createWallet: CreateWalletUseCase,
  ) {}

  @OnEvent(UserCreatedEvent.EVENT_NAME)
  async handle(event: UserCreatedEvent) {

    await this.createWallet.execute(event.userId);
  }
}