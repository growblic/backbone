import {
  Injectable,
  Logger,
} from '@nestjs/common';

import {
  SmsProvider,
  SendSmsPayload,
  SmsProviderResponse,
} from '../providers/interfaces/sms-provider.interface';

@Injectable()
export class SmsRouterService {
  private readonly logger =
    new Logger(
      SmsRouterService.name,
    );

  private providers: SmsProvider[] =
    [];

  registerProvider(
    provider: SmsProvider,
  ) {
    this.providers.push(provider);

    this.logger.log(
      `SMS Provider Registered: ${provider.providerName}`,
    );
  }

  async sendSms(
    payload: SendSmsPayload,
  ): Promise<SmsProviderResponse> {
    if (
      this.providers.length === 0
    ) {
      throw new Error(
        'No SMS providers registered',
      );
    }

    let lastError: any;

    for (const provider of this
      .providers) {
      try {
        this.logger.log(
          `Trying provider: ${provider.providerName}`,
        );

        const response =
          await provider.sendSms(
            payload,
          );

        if (response.success) {
          this.logger.log(
            `SMS sent successfully via ${provider.providerName}`,
          );

          return response;
        }

        lastError =
          response.error;
      } catch (error) {
        lastError = error;

        this.logger.error(
          `Provider failed: ${provider.providerName}`,
        );
      }
    }

    throw new Error(
      `All SMS providers failed: ${lastError}`,
    );
  }
}